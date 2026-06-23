# SVG Converter

Raster image → SVG converter web app, similar to Inkscape's **Trace Bitmap**. Upload an image, adjust the threshold and smoothing, and download a filled SVG path.

## Features

- Upload PNG, JPEG, or other raster images.
- Convert to filled SVG vector paths using [Potrace](https://potrace.sourceforge.net/).
- Preview the converted SVG in the browser and download it.

## Tech Stack

- **Backend**: Python, FastAPI, Pillow, Potrace
- **Frontend**: React, TypeScript, Vite

## Project Structure

```
svgconverter/
├── backend/
│   ├── app/
│   │   ├── main.py       # FastAPI app and /api/convert endpoint
│   │   ├── converter.py  # image → SVG pipeline
│   │   └── models.py     # Pydantic request models
│   ├── requirements.txt
│   └── venv/             # Python virtual environment
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── components/
    │   │   ├── UploadArea.tsx
    │   │   ├── Controls.tsx
    │   │   └── Preview.tsx
    │   └── types.ts
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## Prerequisites

- Python 3.11+
- Node.js 20+
- [Potrace](https://potrace.sourceforge.net/) command-line tool

On macOS Potrace can be installed with Homebrew:

```bash
brew install potrace
```

## Installation

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Running

Start the backend:

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Start the frontend (in another terminal):

```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Usage

1. Click **Choose image** and select a raster image.
2. Adjust the parameters:
   - **Threshold** (0-255): brightness cutoff used to turn the image into black and white.
   - **Smoothing** (0-1.5): Potrace corner threshold. Higher values produce smoother curves.
   - **Invert**: swap foreground and background before tracing.
3. Click **Convert to SVG**.
4. Preview the result and click **Download SVG**.

## API

`POST /api/convert`

Multipart form data:

| Field       | Type    | Default | Description                               |
|-------------|---------|---------|-------------------------------------------|
| `file`      | file    | —       | Raster image file                         |
| `threshold` | integer | 128     | Binarization threshold (0-255)            |
| `smoothing` | float   | 0.2     | Potrace alphamax corner threshold (0-1.5) |
| `invert`    | boolean | false   | Invert black/white before tracing         |

Response: `image/svg+xml`

## How It Works

1. Convert the uploaded image to grayscale.
2. Apply the threshold to create a binary image.
3. Run Potrace to extract filled vector paths as SVG.
4. Return the SVG for preview and download.
