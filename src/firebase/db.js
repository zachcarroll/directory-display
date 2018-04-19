import { db } from './firebase';

// User API
export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');


// Directory API
export const onceGetUserDirectory = (id) =>
  db.ref(`directories/${id}`).once('value');

export const doCreateOrEditDirectory = (id, directory) =>
  db.ref(`directories/${id}`).set(directory);