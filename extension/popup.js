document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('saveForm');
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const contentInput = document.getElementById('content');
  const tagsInput = document.getElementById('tags');
  const typeSelect = document.getElementById('type');
  const saveBtn = document.getElementById('saveBtn');
  const extractBtn = document.getElementById('extractBtn');
  const statusDiv = document.getElementById('status');

  // 🛠️ USE CONFIG SYSTEM
  const currentConfig = CONFIG[CONFIG.MODE];
  const API_BASE = currentConfig.API_URL;
  const AUTH_DOMAIN = currentConfig.AUTH_DOMAIN;

  async function getAuthToken() {
    try {
      // Find Clerk session cookie on the domain set in config 
      const cookies = await chrome.cookies.getAll({ domain: AUTH_DOMAIN });
      const sessionCookie = cookies.find(c => c.name === '__session');
      if (sessionCookie) return sessionCookie.value;
    } catch (e) { 
      console.error('Token retrieval failed', e); 
    }
    return null;
  }

  // 1. Get current tab info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      urlInput.value = activeTab.url;
      titleInput.value = activeTab.title;
      
      // Auto-set type based on URL
      if (activeTab.url.includes('twitter.com') || activeTab.url.includes('x.com')) {
        typeSelect.value = 'tweet';
      } else if (activeTab.url.includes('youtube.com')) {
        typeSelect.value = 'video';
      }
    }
  });

  // 2. Extract content using AI
  extractBtn.addEventListener('click', async () => {
    const originalText = extractBtn.innerText;
    extractBtn.disabled = true;
    extractBtn.innerHTML = '<span class="loader"></span> EXTRACTING...';
    showStatus('', '');

    try {
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(`${API_BASE}/extract`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ url: urlInput.value })
      });

      if (!resp.ok) throw new Error('Extraction failed');
      
      const data = await resp.json();
      if (data.title) titleInput.value = data.title;
      if (data.content) contentInput.value = data.content;
      
      showStatus('Content extracted successfully!', 'success');
    } catch (err) {
      showStatus('Failed to extract content: ' + err.message, 'error');
    } finally {
      extractBtn.disabled = false;
      extractBtn.innerText = originalText;
    }
  });

  // 3. Save to Vault
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = saveBtn.innerText;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="loader"></span> SAVING...';
    showStatus('', '');

    const payload = {
      type: typeSelect.value,
      url: urlInput.value,
      title: titleInput.value,
      content: contentInput.value,
      tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (resp.status === 401) {
        throw new Error(`Unauthorized. Please login to ${AUTH_DOMAIN} then REFRESH extension.`);
      }

      if (!resp.ok) throw new Error('Failed to save item');

      showStatus('VAULTED SUCCESSFULLY!', 'success');
      setTimeout(() => window.close(), 1500);
    } catch (err) {
      showStatus(err.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerText = originalText;
    }
  });

  function showStatus(msg, type) {
    statusDiv.innerText = msg;
    statusDiv.className = 'status-msg';
    if (type) {
      statusDiv.classList.add('status-' + type);
      statusDiv.style.display = 'block';
    } else {
      statusDiv.style.display = 'none';
    }
  }
});
