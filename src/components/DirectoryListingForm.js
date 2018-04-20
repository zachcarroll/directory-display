import React, { Component } from 'react';

import { storage } from '../firebase';

class DirectoryListingForm extends Component {
  constructor(props) {
    super(props);
  }

  onChangeLogo = (files) => {
    const {
      onChangeInfo,
      index,
      onError,
    } = this.props;

    const file = files[0];

    if (!file) {
      return;
    }

    storage.doCreateImage(file)
      .then(res => onChangeInfo(index, 'logo', res.downloadURL))
      .catch(error => onError(error.message));
  };

  render() {
    const {
      listing,
      index,
      onChangeInfo,
      onRemoveListing,
    } = this.props;

    return (
      <div>
        <input
          value={listing.name}
          onChange={e => onChangeInfo(index, 'name', e.target.value)}
          type="text"
          placeholder="Listing Name" 
        />

        <input
          value={listing.location}
          onChange={e => onChangeInfo(index, 'location', e.target.value)}
          type="text"
          placeholder="Listing Location" 
        />

        <input 
          type="file"
          onChange={e => this.onChangeLogo(e.target.files)}
          placeholder="Tenant Logo"
        />

        <button 
          type="button" 
          onClick={() => onRemoveListing(index)}
        >
          Remove Listing
        </button>

      </div>
    );
  }
}

export default DirectoryListingForm;