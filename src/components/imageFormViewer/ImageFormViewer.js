import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

import styles from './style'


class ImageFormViewer extends Component {
  render() {
    const {
      classes,
      logo,
      onDelete,
      altText,
      tooltipText,
    } = this.props;

    return (
      <div className={classes.logoContainer}>
        <img className={classes.logo} src={logo} alt={altText} />
        <Tooltip id="tooltip-icon" title={tooltipText}>
          <IconButton 
            className={classes.deleteButton}
            onClick={onDelete}
            aria-label="delete">
            <i className="material-icons">delete</i>
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(ImageFormViewer);
