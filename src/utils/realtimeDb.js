import { ref, set, get, update, remove, push, onValue } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

// Create or update data
export const writeData = (path, data) => {
  return set(ref(realtimeDb, path), data);
};

// Read data once
export const readData = (path) => {
  return get(ref(realtimeDb, path)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });
};

// Update specific fields
export const updateData = (path, updates) => {
  return update(ref(realtimeDb, path), updates);
};

// Delete data
export const deleteData = (path) => {
  return remove(ref(realtimeDb, path));
};

// Push new data to a list
export const pushData = (path, data) => {
  const newRef = push(ref(realtimeDb, path));
  return set(newRef, data);
};

// Listen for real-time updates
export const listenForData = (path, callback) => {
  const dataRef = ref(realtimeDb, path);
  return onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};