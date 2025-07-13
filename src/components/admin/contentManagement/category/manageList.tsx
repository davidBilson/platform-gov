import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { createItem, deleteItem, getItemsByCategory, updateItemOrder } from '@/api/admin-api';
import { toast } from 'react-toastify';

interface Item {
  _id: string;
  value: string;
  sortOrder: number;
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
    <div className="flex items-center space-x-2 flex-1">
      <div className="w-4 h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="w-5 h-5 bg-gray-200 rounded"></div>
  </li>
);

const ItemListSkeleton = () => (
  <ul className="divide-y divide-gray-200 h-[calc(40vh)]">
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <ItemSkeleton key={i} />
    ))}
  </ul>
);

const ManageList = ({ categoryId }: ManageListProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  const dragCounter = useRef(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await getItemsByCategory(categoryId);
        setItems(response.data || []);
      } catch (err) {
        console.log(err);
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
      setItems([...items, response.data]);
      setNewItem('');
      toast.success('Item added successfully');
    } catch (err) {
      console.log(err);
      toast.error('Item already exists or failed to add');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('Item deleted successfully');
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete item');
    }
  };

  const updateItemsOrder = async (reorderedItems: Item[]) => {
    try {
      setIsUpdatingOrder(true);
      
      // Create the items array with new sort orders
      const itemsWithNewOrder = reorderedItems.map((item, index) => ({
        id: item._id,
        sortOrder: index + 1
      }));

      await updateItemOrder(itemsWithNewOrder);

      // Update local state with new sort orders
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        sortOrder: index + 1
      }));
      
      setItems(updatedItems);
      toast.success('Items order updated successfully');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update items order');
      // Revert to original order on error
      setItems(items);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDraggedOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDraggedOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const draggedIndex = items.findIndex(item => item._id === draggedItem._id);
    
    if (draggedIndex === dropIndex) {
      setDraggedItem(null);
      setDraggedOverIndex(null);
      dragCounter.current = 0;
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    
    setItems(newItems);
    updateItemsOrder(newItems);
    
    setDraggedItem(null);
    setDraggedOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverIndex(null);
    dragCounter.current = 0;
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
            className="flex-1 border border-deepskyblue/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-deepskyblue text-sm"
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
          No items found. Add your first item above.
        </div>
      ) : (
        <div className="space-y-2">
          {items.length > 1 && (
            <div className="text-xs text-gray-500 mb-2">
              💡 Drag items to reorder them
            </div>
          )}
          
          <ul className="divide-y divide-gray-200 h-[calc(40vh)] overflow-y-auto">
            {items.map((item, index) => (
              <li
                key={item._id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`py-3 flex justify-between items-center text-xs transition-all duration-200 ${
                  draggedItem?._id === item._id 
                    ? 'opacity-50 scale-95' 
                    : ''
                } ${
                  draggedOverIndex === index && draggedItem?._id !== item._id
                    ? 'border-t-2 border-deepskyblue' 
                    : ''
                } ${
                  isUpdatingOrder ? 'pointer-events-none opacity-75' : 'cursor-move'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <GripVertical 
                    size={16} 
                    className={`text-gray-400 ${
                      draggedItem?._id === item._id ? 'text-deepskyblue' : ''
                    }`} 
                  />
                  <span className="text-gray-800 select-none">{item.value}</span>
                </div>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer p-1 hover:bg-red-50 rounded"
                  aria-label="Delete item"
                  disabled={isUpdatingOrder}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          
          {isUpdatingOrder && (
            <div className="text-xs text-blue-600 text-center py-2">
              Updating order...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageList;