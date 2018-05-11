import React, { Component } from 'react';
import update from 'immutability-helper';

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';

import withAuthorization from './withAuthorization';
import AuthUserContext from './AuthUserContext';
import DirectoryListingForm from './DirectoryListingForm';
import DirectoryBuildingForm from './DirectoryBuildingForm';
import { db } from '../firebase';

// TODO: move to utilities file
const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_DIRECTORY = {
  buildingName: '',
  logo: '',
  listings: [],
};

const DirectoryFormPage = () =>
  <AuthUserContext.Consumer>
    {
      authUser => 
        <div style={{padding: '20px'}}>
          <h1>Edit Your Building Directory Information</h1>
          <DirectoryForm uid={authUser.uid} />
        </div>
    }
  </AuthUserContext.Consumer>

class DirectoryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      directory: INITIAL_DIRECTORY,
      error: null,
      showSaveSnackbar: false,
    };
  }

  componentDidMount() {
    db.onceGetUserDirectory(this.props.uid)
      .then(res => 
        this.setState(update(this.state, {
          directory: {$merge: res.val() || INITIAL_DIRECTORY}})));
  }

  handleAddListing = () =>
    this.setState(update(this.state, {
      directory: {
        listings: {$push: [{name: '', location: '', members: []}]}
      }
    }));

  onSubmit = (event) => {
    db.doCreateOrEditDirectory(this.props.uid, this.state.directory)
      .then(this.handleToggleSaveSnackbar)
      .catch(error => this.handleError(error));

    event.preventDefault();
  };

  handleToggleSaveSnackbar = () =>
    this.setState(update(this.state, {
      showSaveSnackbar: {$set: !this.state.showSaveSnackbar}
    }));

  handleBuildingInfoChange = (propertyName, value) =>
    this.setState(update(this.state, {
      directory: {$merge: {[propertyName]: value}}
    }));


  handleListingInfoChange = (index, propertyName, value) => 
    this.setState(update(this.state, {
      directory: {
        listings: {
          [index]: {$merge: {[propertyName]: value}}
        }
      }
    }));

  handleRemoveListing = (index) => 
    this.setState(update(this.state, {
      directory: {
        listings: {$splice: [[index, 1]]}
      }
    }));

  handleAddListingMember = (listingIndex) =>
    this.setState(update(this.state, {
      directory: {
        listings: {
          [listingIndex]: {
            members: {$push: ['']}
          }
        } 
      }
    }));

  handleError = (error) =>
    this.setState(byPropKey('error', error));

  handleListingMemberChange = (listingIndex, memberIndex, value) =>
    this.setState(update(this.state, {
      directory: {
        listings: {
          [listingIndex]: {
            members: {
              [memberIndex]: {$set: value}
            }
          }
        }
      }
    }));

  handleRemoveMember = (listingIndex, memberIndex) =>
    this.setState(update(this.state, {
      directory: {
        listings: {
          [listingIndex]: {
            members: {$splice: [[memberIndex, 1]]}
          }
        }
      }
    }));

  render() {
    const {
      directory,
      error,
      showSaveSnackbar,
    } = this.state;

    const listings = directory && directory.listings
      ? directory.listings.map((n, index) => 
        <DirectoryListingForm 
          listing={n}
          key={index}
          index={index}
          onChangeInfo={this.handleListingInfoChange}
          onChangeMemberInfo={this.handleListingMemberChange}
          onRemoveMember={this.handleRemoveMember}
          onAddMember={this.handleAddListingMember}
          onRemoveListing={this.handleRemoveListing}
          onError={this.handleError} />) 
      : [];

    return directory
      ? (
      <Grid container style={{flexGrow: 1}} spacing={16}>
        <Grid item xs={12}>
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <DirectoryBuildingForm
                  onError={this.handleError}
                  onChangeInfo={this.handleBuildingInfoChange}
                  name={directory.buildingName}
                  logo={directory.logo} />
              </Grid>
              <Grid item xs={12}>
                {listings}
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={5}>
                <Button 
                  color="secondary" 
                  variant="raised" 
                  style={{'width': '100%'}}
                  onClick={this.handleAddListing}>
                  Add a Listing
                  <i style={{marginLeft: '15px'}} className="material-icons">add_location</i>
                </Button>
              </Grid>
              <Grid item xs={5}>
                <Button 
                  style={{'width': '100%'}}
                  color="primary" 
                  variant="raised" 
                  type="submit">
                  Save Changes
                  <i style={{marginLeft: '10px'}} className="material-icons">save</i>
                </Button>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid item xs={12}>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={showSaveSnackbar}
              autoHideDuration={1500}
              onClose={this.handleToggleSaveSnackbar}
              message={<div>Changes Saved</div>} />

              { error && <p>{error}</p> }
            </Grid>
          </form>
        </Grid>
      </Grid>
    )
    : <div>Loading</div>;
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(DirectoryFormPage);

export {
  DirectoryForm,
};
