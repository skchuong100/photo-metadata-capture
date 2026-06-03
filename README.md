# Photo Metadata Capture

A browser-based work sample for taking a new photo with the device camera, capturing GPS and timestamp metadata, storing the capture locally, and viewing the result in a photo feed with location details.

## Features

- Take a new photo using the device camera
- Capture timestamp metadata at the time the photo is taken
- Capture GPS coordinates through the browser Geolocation API
- Display captured photos in a masonry-style feed
- View photo metadata in a modal
- Show the captured location using Google Maps
- Store photos and metadata locally in the browser using IndexedDB
- Responsive layout for desktop and mobile browsers

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules
- React Icons
- IndexedDB
- Browser MediaDevices API
- Browser Geolocation API
- Google Maps Embed API

## Requirements

Before running the project locally, make sure you have:

- Node.js installed
- npm installed
- A Google Maps API key if you want the embedded map preview to load

Camera and GPS access require a secure browser context. They work on `localhost` during local development and should also work on an HTTPS deployment such as GitHub Pages.

## Live Demo
[View the deployed app](https://skchuong100.github.io/photo-metadata-capture/)

## Run Locally

Clone the repository:

```bash
git clone <repository-url>
cd photo-metadata-capture
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your Google Maps API key to `.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal. It is usually:

```txt
http://localhost:5173/
```

## Google Maps Setup

The app reads the Google Maps key from:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Because this is a frontend-only Vite app, the Google Maps key is included in the browser bundle. Restrict the key in Google Cloud Console before deploying.

Recommended key restrictions:

- Application restriction: HTTP referrers
- API restriction: Google Maps Embed API
- Local referrer: `http://localhost:*/*`
- Deployed referrer: your GitHub Pages URL

If the key is missing, the app still shows the captured coordinates and accuracy, but the embedded Google Map will not load.

## Browser Permissions

The app asks for:

- Camera permission to take a new photo
- Location permission to capture GPS coordinates

If either permission is denied, the app shows an error message instead of failing silently.

## Local Storage Behavior

Captured photos and metadata are stored locally in the browser using IndexedDB. No backend or external database is required.

Clearing browser site data will remove saved captures.

## Notes

This project is designed as a focused work sample. It does not support uploading existing photos because the requested flow is based on taking a new photo with the device camera.
