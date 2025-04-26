// stores/useFeedStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Create the base store
const createBaseStore = (set, get) => ({
  feedType: 'jobs', // default feed type (not persisted)
  savedSearches: [], // Array to store saved searches (persisted)
  
  setFeedType: (type) => {
    if (type === 'Contractors' || type === 'Jobs') {
      set({ feedType: type })
    }
  },
  
  // Add a new saved search
  addSavedSearch: (search) => {
    const { savedSearches } = get()
    // Check if search already exists to avoid duplicates
    const exists = savedSearches.some(
      item => item.query === search.query && item.feedType === search.feedType
    )
    
    if (!exists) {
      set({
        savedSearches: [
          ...savedSearches,
          { 
            id: Date.now(), // Use timestamp as unique ID
            query: search.query,
            feedType: search.feedType,
            name: search.name || search.query // Use provided name or default to query
          }
        ]
      })
      return true
    }
    return false
  },
  
  // Remove a saved search by ID
  removeSavedSearch: (id) => {
    const { savedSearches } = get()
    set({
      savedSearches: savedSearches.filter(search => search.id !== id)
    })
  },
  
  // Get saved searches filtered by feed type
  getSavedSearchesByFeedType: (feedType) => {
    return get().savedSearches.filter(search => search.feedType === feedType)
  }
})

// Create the store with persistence middleware that only persists savedSearches
export const useFeedStore = create(
  persist(
    createBaseStore,
    {
      name: 'feed-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ 
        savedSearches: state.savedSearches 
        // Only savedSearches will be persisted, feedType will not
      })
    }
  )
)