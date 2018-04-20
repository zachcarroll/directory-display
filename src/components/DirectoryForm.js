import React, { Component } from 'react';
import update from 'immutability-helper';

import withAuthorization from './withAuthorization';
import AuthUserContext from './AuthUserContext';
import DirectoryListingForm from './DirectoryListingForm';
import { db, storage } from '../firebase';

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

  onSubmit = (event) => {
    const {
      directory,
    } = this.state;

    const {
      uid,
    } = this.props;

    db.doCreateOrEditDirectory(uid, directory)
      .then(() => console.log('updated'))
      .catch(error => this.handleError(error));

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

  // move to own component
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
            listings: [{name: '', location: '', image: null}]
          }}
        });
  };

  // move to own component
  uploadBuildingImage = (files) => {
    const {
      uid,
    } = this.props;

    const file = files[0];

    if (!file) {
      return;
    }

    storage.doCreateImage(uid, file)
      .then(res => this.setState(update(this.state, {
        directory: {$merge: {buildingImage: res.downloadURL}}
      })))
      .catch(error => this.handleError(error));
  };

  handleListingInfoChange = (index, propertyName, value) => 
    this.setState(update(this.state, {
      directory: {
        listings: {
          [index]: {$merge: {[propertyName]: value}}
        }
      }
    }));

  handleListingRemoval = (index) => 
    this.setState(update(this.state, {
      directory: {
        listings: {$splice: [[index, 1]]}
      }
    }));

  handleError = (error) => {
    this.setState(byPropKey('error', error));
  };

  render() {
    const {
      directory,
      error,
    } = this.state;

    const listings = directory && directory.listings 
      ? directory.listings.map((n, index) => 
        <DirectoryListingForm 
          listing={n}
          key={index}
          index={index}
          onChangeInfo={this.handleListingInfoChange}
          onRemoveListing={this.handleListingRemoval}
          onError={this.handleError}
        />
      ) 
      : [];

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          {/* move these two inputs to own component */}
          <input
            type="text"
            value={directory ? directory.buildingName : ''}
            onChange={e => 
              this.setState(this.setBuildingName(e.target.value))}
            placeholder="Building Name"
          />
          <input 
            onChange={e =>
              this.uploadBuildingImage(e.target.files)}
            type="file"
            placeholder="Building Logo"
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
