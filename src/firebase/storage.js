import { storage } from './firebase';

// add a file to /images directory in storage
export const doCreateImage = (file, name) =>
  storage.ref(`images/${name}`).put(file);
