from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from .converter import image_to_svg
from .models import ConvertParams

app = FastAPI(title="SVG Converter for 3D Printing")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/convert")
async def convert_image(
    file: UploadFile = File(...),
    threshold: int = Form(128),
    smoothing: float = Form(0.2),
    invert: bool = Form(False),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    params = ConvertParams(
        threshold=threshold,
        smoothing=smoothing,
        invert=invert,
    )

    try:
        svg_content = image_to_svg(image_bytes, params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    filename = file.filename or "image"
    return Response(
        content=svg_content,
        media_type="image/svg+xml",
        headers={"Content-Disposition": f'attachment; filename="{filename}.svg"'},
    )
