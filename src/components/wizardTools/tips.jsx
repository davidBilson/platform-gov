import React, { useState, useEffect } from 'react';
import { fetchTips } from '@/api/subscription-api';
import DotLoader from '../ui/dotloader';

const Tips = () => {
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTips = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchTips();
        
        if (response.success) {
          setTips(response.tips);
        } else {
          setError('Failed to fetch tips');
        }
      } catch (err) {
        setError('Error loading tips: ' + err.message);
        console.error('Error fetching tips:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  if (loading) {
    return (
      <main>
        <section className='flex flex-col gap-2'>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
          <p className='h-4 p-1 bg-gray-100 animate-pulse'></p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <h2>Tips</h2>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {tips}
        </div>
      </section>
    </main>
  );
};

export default Tips;