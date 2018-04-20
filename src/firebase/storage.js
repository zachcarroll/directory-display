import { storage } from './firebase';

export const doCreateImage = (file) =>
  storage.ref(`images`).put(file);
