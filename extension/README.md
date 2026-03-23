# MindVault Chrome Extension - Save Tool

This extension allows you to save any webpage, article, or video to your MindVault database with one click. It uses the MindVault backend API to extract content and store it for semantic search.

## Features
- **Auto-Capture**: Automatically gets the current page title and URL.
- **AI Extraction**: Uses the backend's extraction engine to pull the main content from articles.
- **Smart Formatting**: Detects if the page is a Tweet, Youtube Video, or Article.
- **Vaulting**: Sends data directly to your MindVault backend.

## How to Install
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the `mindvault/extension` folder from this project.
5. The extension will appear in your toolbar!

## Note on Authentication
Make sure you are logged in to the MindVault web app (`localhost:5173`) before using the extension. The extension will use your browser's session cookies to authenticate with the backend.
