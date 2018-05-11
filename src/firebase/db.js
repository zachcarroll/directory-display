import { db } from './firebase';

// Creates a new user along with metadata
export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({username, email});

// Retreive a user's directory
export const onceGetUserDirectory = (id) =>
  db.ref(`directories/${id}`).once('value');

// Creates or edits a given user's directory
export const doCreateOrEditDirectory = (id, directory) =>
  db.ref(`directories/${id}`).set(directory);

// Generates a unique key using .push()
// to be used as image name to ensure no 
// overwriting of existing images in storage
export const doCreateUniqueImageName = () =>
  db.ref(`images`).push(true).then(ref => ref.key);
