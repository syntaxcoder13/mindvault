import { useAuth } from '@clerk/clerk-react';
import * as api from '../api';

export function useApi() {
  const { getToken } = useAuth();

  const withToken = (fn) => async (...args) => {
    const token = await getToken();
    return fn(token, ...args);
  };

  return {
    fetchItems: withToken(api.fetchItems),
    fetchItem: withToken(api.fetchItem),
    deleteItem: withToken(api.deleteItem),
    saveItem: withToken(api.saveItem),
    togglePin: withToken(api.togglePin),
    updateItem: withToken(api.updateItem),
    fetchRelated: withToken(api.fetchRelated),
    fetchResurface: withToken(api.fetchResurface),
    addHighlight: withToken(api.addHighlight),
    fetchCollections: withToken(api.fetchCollections),
    createCollection: withToken(api.createCollection),
    fetchGraphData: withToken(api.fetchGraphData),
  };
}
