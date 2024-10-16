import React, { useState, useEffect } from 'react';
import { writeData, readData, updateData, deleteData, pushData, listenForData } from '../utils/realtimeDb';

const RealtimeDbExample = () => {
  const [data, setData] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Listen for real-time updates
    const unsubscribe = listenForData('items', (newData) => {
      setData(newData);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleAddItem = () => {
    pushData('items', { name: newItem });
    setNewItem('');
  };

  const handleUpdateItem = (key) => {
    updateData(`items/${key}`, { name: `${data[key].name} (updated)` });
  };

  const handleDeleteItem = (key) => {
    deleteData(`items/${key}`);
  };

  return (
    <div>
      <h2>Realtime Database Example</h2>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="New item name"
      />
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {data && Object.entries(data).map(([key, value]) => (
          <li key={key}>
            {value.name}
            <button onClick={() => handleUpdateItem(key)}>Update</button>
            <button onClick={() => handleDeleteItem(key)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RealtimeDbExample;