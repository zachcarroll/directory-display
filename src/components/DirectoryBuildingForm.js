import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Card, { CardContent } from 'material-ui/Card';

import ImageUploader from './imageUploader/ImageUploader';
import ImageFormViewer from './imageFormViewer/ImageFormViewer';


class DirectoryBuildingForm extends Component {
  render() {
    const {
      onChangeInfo,
      name,
      logo,
      onError,
    } = this.props;

    const logoElement =
      <Grid container spacing={16}>
        <Grid item xs={12}>
          { logo 
            ? <ImageFormViewer
                logo={logo}
                altText="building logo"
                tooltipText="Delete Building Logo"
                onDelete={e => onChangeInfo('logo', '')} />
            : <ImageUploader 
                message="Click to Upload Your Building's Logo"
                onUpload={url => onChangeInfo('logo', url)}
                onError={error => onError(error)} /> }
        </Grid>
      </Grid>;

    return (
      <Grid container spacing={16}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Card>
            <CardContent>
              <Grid container spacing={16}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Building Name"
                    value={name}
                    onChange={e => onChangeInfo('buildingName', e.target.value)} />
                </Grid>
                <Grid item xs={4}>
                  {logoElement}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    );
  }
}

export default DirectoryBuildingForm;