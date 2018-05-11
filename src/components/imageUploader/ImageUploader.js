import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import ButtonBase from 'material-ui/ButtonBase';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import update from 'immutability-helper';

import styles from './style';
import { storage, db } from '../../firebase';

class ImageUploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
    };
  }

  onChangeLogo = (files) => {
    const {
      onUpload,
      onError,
    } = this.props;

    const file = files[0];

    if (!file) {
      return;
    }

    this.setState(update(this.state, {
      uploading: {$set: !this.state.uploading}
    }));

    db.doCreateUniqueImageName()
      .then(name => storage.doCreateImage(file, name)
        .then(res => onUpload(res.downloadURL))
        .catch(error => onError(error.message)))
      .catch(error => onError(error.message));
  };

  render() {
    const {
      classes,
      message,
    } = this.props;

    const {
      uploading,
    } = this.state;

    return (
      <ButtonBase className={classes.uploadBox} component="label">
        <Grid container spacing={16}>
          <Grid item xs={12}>
            {
              uploading 
                ? <CircularProgress size={42} /> 
                : <i className={`material-icons ` + classes.uploadIcon}>
                    cloud_upload
                  </i>
            }
          </Grid>
          <Grid item xs={12}>{message}</Grid>
          <Grid item xs={12}>
            <input
              onChange={e => this.onChangeLogo(e.target.files)}
              style={{ display: 'none' }}
              type="file" />
          </Grid>
        </Grid>
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(ImageUploader);