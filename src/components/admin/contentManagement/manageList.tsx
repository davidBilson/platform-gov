import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createItem, deleteItem, getItemsByCategory } from '@/api/admin-api';
import { toast } from 'react-toastify';

interface Item {
  _id: string;
  value: string;
}

interface ManageListProps {
  categoryId: string;
}

// Skeleton Components
const InputSkeleton = () => (
  <div className="flex items-center space-x-2 animate-pulse">
    <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
  </div>
);

const ItemSkeleton = () => (
  <li className="py-3 flex justify-between items-center animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="w-5 h-5 bg-gray-200 rounded"></div>
  </li>
);

const ItemListSkeleton = () => (
  <ul className="divide-y divide-gray-200">
    {[1, 2, 3, 4, 5].map((i) => (
      <ItemSkeleton key={i} />
    ))}
  </ul>
);

const ManageList: React.FC<ManageListProps> = ({ categoryId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await getItemsByCategory(categoryId);
        setItems(response.data || []);
      } catch (err) {
        console.log(err)
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId]);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    
    try {
      const response = await createItem(categoryId, newItem.trim());
      setItems([response.data, ...items]);
      setNewItem('');
    } catch (err) {
        console.log(err)
        toast.error('Item already exists or failed to add');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
        console.log(err)
        toast.error('Failed to delete item');
    }
  };

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Input Section */}
      {loading ? (
        <InputSkeleton />
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item"
            className="flex-1 border border-deepskyblue/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-deepskyblue"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button
            onClick={handleAddItem}
            className="bg-deepskyblue text-white p-2 rounded-lg hover:bg-deepskyblue/50 transition cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <ItemListSkeleton />
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No items in this category yet
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item._id} className="py-3 flex justify-between items-center">
              <span className="text-gray-800">{item.value}?</span>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
                aria-label="Delete item"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageList;