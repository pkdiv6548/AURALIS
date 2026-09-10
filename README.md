# OpenBeat Premium Music Player — Vanilla JS + Vercel YouTube

A build-free, GitHub/Vercel-friendly music player. The frontend is plain HTML/CSS/JavaScript. The only server-side code is the Vercel Function used to protect the YouTube API key.

## Features

- Premium responsive music-player UI
- 8 visual player modes: Minimal, Click Wheel, Vinyl, Glass, Neon, Orbital, Aurora, Prism
- 5 bundled playable OpenBeat demo tracks
- Play/pause, previous/next, seek, volume, repeat and smart shuffle
- Lyrics panel with timed demo lyrics and tap-to-seek
- Queue and YouTube queue
- Local audio file picker
- AutoMix UI and sleep timer
- Quality / Spatial UI
- PWA manifest + service worker
- YouTube Data API search through `/api/youtube`
- YouTube IFrame Player playback inside the OpenBeat player after clicking **Play** on a search result
- Custom OpenBeat controls for YouTube playback: play/pause, seek, volume, previous/next queue item
- No React, Vite, Node.js or npm required for the frontend

## Vercel deployment

1. Extract this folder and push the **contents of `openbeat_final/`** to the GitHub repository root, or set `openbeat_final` as the Vercel Root Directory.
2. Create a Google Cloud project and enable **YouTube Data API v3**.
3. Create an API key.
4. In Vercel: Project → Settings → Environment Variables.
5. Add:

   `YOUTUBE_API_KEY` = `YOUR_REAL_YOUTUBE_DATA_API_V3_KEY`

6. Enable it for Production (and Preview if desired).
7. Redeploy.
8. Open `/api/youtube?q=lofi` to test the JSON response.
9. Search from OpenBeat and click **Play**. The selected YouTube video loads in the embedded player.

## Important YouTube behavior

The YouTube Data API returns video metadata/search results; it does not provide a raw audio stream. OpenBeat therefore uses the official YouTube IFrame Player API for playback. This keeps the key server-side while using YouTube's supported embedded-player mechanism.

For GitHub Pages, the static frontend and bundled local tracks work, but `/api/youtube` requires Vercel (or another server-side function). Do not put the real API key in `app.js`, HTML, or any public `NEXT_PUBLIC_*`-style variable.
