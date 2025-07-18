// stores/useFeedStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Create the base store
const createBaseStore = (set, get) => ({
  feedType: 'Consultants', // default feed type (not persisted)
  savedSearches: [], // Array to store saved searches (persisted)

  setFeedType: (type) => {
    if (type === 'Consultants' || type === 'Jobs') {
      set({ feedType: type })
    }
  },

  // Add a new saved search
  addSavedSearch: (search) => {
    const { savedSearches } = get()
    const exists = savedSearches.some(
      item => item.query === search.query &&
              item.feedType === search.feedType &&
              item.filters === search.filters
    )

    if (!exists) {
      set({
        savedSearches: [
          ...savedSearches,
          {
            id: Date.now(), // Use timestamp as unique ID
            query: search.query || '',
            feedType: search.feedType || 'Jobs',
            name: search.name || search.query || 'Unnamed Search',
            filters: search.filters || '' // Store filters as JSON string
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
      })
    }
  )
)
