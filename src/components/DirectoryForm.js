import React, { Component } from 'react';
import update from 'immutability-helper';

import withAuthorization from './withAuthorization';
import AuthUserContext from './AuthUserContext';
import { db } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const DirectoryFormPage = () =>
  <AuthUserContext.Consumer>
    {
      authUser => 
        <div>
          <h1>Building Directory</h1>
          <DirectoryForm uid={authUser.uid} />
        </div>
    }
  </AuthUserContext.Consumer>

class DirectoryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      directory: null,
      error: null,
    };
  }

  componentDidMount() {
    db.onceGetUserDirectory(this.props.uid)
      .then(snapshot =>
        this.setState(
          () => ({ directory: snapshot.val() })));
  }

  byListing = (index, propertyName, value) =>
    update(this.state, {
      directory: {
        listings: {
          [index]: {$merge: {[propertyName]: value}}
        }
      }
    });

  onSubmit = (event) => {
    const {
      directory,
    } = this.state;

    const {
      uid,
    } = this.props;

    db.doCreateOrEditDirectory(uid, directory)
      .then(() => {
        // TODO
        console.log('updated');
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  addListing = () => {
    const {
      directory,
    } = this.state;

    return directory 
      ? update(this.state, {
          directory: {
            listings: {$push: [{name: '', location: ''}]}
          }
        })
      : update(this.state, {
          directory: {$set: {
            buildingName: '',
            listings: [{name: '', location: ''}]
          }
        }
      });
  };

  setBuildingName = (value) => {
    const {
      directory,
    } = this.state;

    return directory
      ? update(
        this.state, {
          directory: {$merge: {buildingName: value}}
        })
      : update(
        this.state, {
          directory: {$set: {
            buildingName: '', 
            listings: [{name: '', location: ''}]
          }}
        });
  };

  removeListing = (index) =>
    update(this.state, {
      directory: {
        listings: {$splice: [[index, 1]]}
      }
    });

  render() {
    const {
      directory,
      error,
    } = this.state;

    const listings = directory && directory.listings ? directory.listings.map((n, index) => 
      <div key={index}>
        <input
          value={n.name}
          onChange={event => 
            this.setState(this.byListing(index, 'name', event.target.value))}
          type="text"
          placeholder="Listing Name" 
        />

        <input
          value={n.location}
          onChange={event => 
            this.setState(this.byListing(index, 'location', event.target.value))}
          type="text"
          placeholder="Listing Location" 
        />

        <button 
          type="button" 
          onClick={() => 
            this.setState(this.removeListing(index))}
        >
          Remove Listing
        </button>

      </div>
    ) : [];

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            value={directory ? directory.buildingName : ''}
            onChange={event => 
              this.setState(this.setBuildingName(event.target.value))}
            placeholder="Building Name"
          />

          {listings}

          <button 
            type="button" 
            onClick={() => 
              this.setState(this.addListing())}
          >
            Add a Listing
          </button>
          
          <button type="submit">Submit</button>

          { error && <p>{error.message}</p> }
        </form>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(DirectoryFormPage);

export {
  DirectoryForm,
};
