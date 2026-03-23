# MindVault

A personal knowledge management web app designed with an editorial, brutalist-meets-refined aesthetic. It allows you to save bookmarks, articles, images, PDFs, and notes, automatically tags them utilizing the Anthropic Claude API, and provides local semantic vector search built over `@xenova/transformers`.

## Setup Instructions

### Environment Variable setup
Ensure you have set the Anthropic API key in your environment or locally via a `.env` file in the `backend/` directory:
```
ANTHROPIC_API_KEY=your_api_key_here
```

### Run the Backend & Frontend
You need to run the Node.js Express backend and Vite frontend separately.

```bash
cd backend && npm install && npm run dev
```

Then in a new terminal:
```bash
cd frontend && npm install && npm run dev
```

Open the given local url for the frontend (typically `http://localhost:5173`) in your browser to view MindVault.

## Core Features
- **Local SQLite DB** storing all saved items securely on your machine.
- **Local Vector Search** embeddings automatically computed in the background using HuggingFace Xenova pipeline upon saving.
- **AI Tag suggestions** powered by Anthropic's Claude.
- **Graph View** force-directed D3 visualization for visually exploring the similarity between your knowledge items.
- **Memory Resurfacing** dashboard panel constantly rotates 3 of your older vault items to trigger serendiptious recall.
