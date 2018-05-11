import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { InputAdornment } from 'material-ui/Input';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import ImageUploader from './imageUploader/ImageUploader';
import ImageFormViewer from './imageFormViewer/ImageFormViewer';


class DirectoryListingForm extends Component {
  render() {
    const {
      listing,
      index,
      onChangeInfo,
      onRemoveListing,
      onError,
      onChangeMemberInfo,
      onAddMember,
      onRemoveMember,
    } = this.props;

    const logo = 
      <Grid container spacing={16}>
        <Grid item xs={12}>
          { listing.logo 
            ? <ImageFormViewer
                logo={listing.logo}
                altText="listing logo"
                tooltipText="Delete Listing Logo"
                onDelete={e => onChangeInfo(index, 'logo', '')} />
            : <ImageUploader 
                message={`Click to Upload a Logo for ${listing.name || 'this Listing'}`}
                onUpload={url => onChangeInfo(index, 'logo', url)}
                onError={error => onError(error)} /> }         
        </Grid>
      </Grid>

    const members = listing.members
      ? listing.members.map((member, i) => 
          <Grid key={i} item xs={12}>
            <TextField
              fullWidth
              label="Member Info"
              value={member}
              InputProps={{
                endAdornment: 
                  (<InputAdornment position="end">
                    <Tooltip title="Remove Member">
                      <IconButton 
                        onClick={() => onRemoveMember(index, i)}
                        color="default" 
                        aria-label="remove">
                        <i className="material-icons">close</i>
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>),
              }}
              onChange={e => onChangeMemberInfo(index, i, e.target.value)} />
          </Grid>
      )
      : null;

    return (
      <Grid container spacing={16}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Card>
            <CardContent>
              <Grid container spacing={16}>
                <Grid item xs={8}>
                  <Grid container spacing={16}>
                    <Grid style={{marginBottom: '15px'}} item xs={12}>
                      <TextField
                        fullWidth
                        label="Listing Name"
                        value={listing.name}
                        onChange={e => onChangeInfo(index, 'name', e.target.value)} />
                    </Grid>
                    
                    <Grid style={{marginBottom: '15px'}} item xs={12}>
                      <TextField
                        fullWidth
                        value={listing.location}
                        onChange={e => onChangeInfo(index, 'location', e.target.value)}
                        label="Listing Location" />
                    </Grid>

                    {members}

                  </Grid>

                </Grid>
                <Grid item xs={4}>
                  {logo}
                </Grid>
              </Grid>
            </CardContent>
            <CardActions style={{position: 'relative', height: '60px'}}>
              <Button
                style={{position: 'absolute', left: '15px'}}
                color="primary"
                onClick={() => onAddMember(index)}>
                Add a Member
                <i style={{marginLeft: '10px'}} className="material-icons">account_circle</i>
              </Button>
              <Button
                style={{position: 'absolute', right: '15px'}}
                color="secondary"
                onClick={() => onRemoveListing(index)}>
                Remove Listing
                <i style={{marginLeft: '10px'}} className="material-icons">delete</i>
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    );
  }
}

export default DirectoryListingForm;