const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

async function request(url, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[API REQUEST] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body) : '');

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchItems(token, query = '', tag = '') {
  let url = `${BASE_URL}/items`;
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (tag) params.append('tag', tag);
  if (params.toString()) url += `?${params.toString()}`;
  
  return request(url, {}, token);
}

export async function fetchItem(token, id) {
  return request(`${BASE_URL}/items/${id}`, {}, token);
}

export async function deleteItem(token, id) {
  return request(`${BASE_URL}/items/${id}`, {
    method: 'DELETE'
  }, token);
}

export async function saveItem(token, data) {
  return request(`${BASE_URL}/items`, {
    method: 'POST',
    body: JSON.stringify(data)
  }, token);
}

export async function togglePin(token, id) {
  return request(`${BASE_URL}/items/${id}/pin`, { method: 'PATCH' }, token);
}

export async function updateItem(token, id, data) {
  return request(`${BASE_URL}/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }, token);
}

export async function fetchRelated(token, id) {
  return request(`${BASE_URL}/items/${id}/related`, {}, token);
}

export async function fetchResurface(token) {
  return request(`${BASE_URL}/resurface`, {}, token);
}

export async function addHighlight(token, id, highlight) {
  return request(`${BASE_URL}/items/${id}/highlights`, {
    method: 'PATCH',
    body: JSON.stringify({ highlight })
  }, token);
}

export async function fetchCollections(token) {
  return request(`${BASE_URL}/collections`, {}, token);
}

export async function extractMetadata(token, url) {
  return request(`${BASE_URL}/extract`, {
    method: 'POST',
    body: JSON.stringify({ url })
  }, token);
}

export async function createCollection(token, name) {
  return request(`${BASE_URL}/collections`, {
    method: 'POST',
    body: JSON.stringify({ name })
  }, token);
}

export async function fetchGraphData(token) {
  return request(`${BASE_URL}/graph`, {}, token);
}
