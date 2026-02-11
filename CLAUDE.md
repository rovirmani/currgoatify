# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Currgoatify is a Chrome extension that uses face detection (face-api.js) to identify images of LeBron James on web pages and replace them with Steph Curry. Built as a fun project using the Chrome Extension API with Parcel as the bundler.

## Tech Stack

- **Language**: JavaScript (ES6+)
- **Platform**: Chrome Extension (Manifest V2/V3)
- **Face Detection**: face-api.js
- **Bundler**: Parcel
- **Package Manager**: npm

## Project Structure

```
currgoatify/
├── package.json          # npm dependencies and scripts
├── manifest.json         # Chrome extension manifest
├── mainscript.js         # Core extension logic (face detection + replacement)
├── models/               # face-api.js model weights
├── dist/                 # Bundled output (Parcel build)
├── node_modules/         # Dependencies
└── .github/workflows/
    └── claude.yml        # Claude Code Actions workflow
```

## Development Commands

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Watch mode (rebuild on changes)
npm run watch

# Load in Chrome:
# 1. Go to chrome://extensions
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select the dist/ directory
```

## Environment & Config

- `manifest.json` defines extension permissions, content scripts, and metadata
- No `.env` file needed -- all logic runs client-side
- face-api.js models are stored locally in `models/`

## Code Style & Standards

- Vanilla JavaScript, no TypeScript
- No linter configured
- Chrome Extension API patterns (content scripts, background scripts)
- face-api.js async patterns for face detection

## Architecture Notes

- `mainscript.js` runs as a content script injected into web pages
- Uses face-api.js to detect faces in images on the page
- Compares detected faces against reference models to identify LeBron
- Replaces matching images with Steph Curry images
- Parcel bundles everything into `dist/` for Chrome to load

## Troubleshooting

- Extension not loading: Ensure you're loading from `dist/` after running `npm run build`
- Face detection not working: Check that model files exist in `models/`
- Build errors: Run `npm install` to ensure all dependencies are present
- Chrome permissions: Check `manifest.json` for required host permissions
