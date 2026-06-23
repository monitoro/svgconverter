import io
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

from .models import ConvertParams


def image_to_svg(image_bytes: bytes, params: ConvertParams) -> str:
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        input_path = tmpdir / "input.pbm"
        output_path = tmpdir / "output.svg"

        img = Image.open(io.BytesIO(image_bytes)).convert("L")
        if params.invert:
            img = ImageOps.invert(img)

        threshold = max(0, min(255, params.threshold))
        binary = img.point(lambda p: 255 if p >= threshold else 0, mode="1")
        binary.save(input_path)

        cmd = [
            "potrace",
            "-s",
            "-o",
            str(output_path),
            "-a",
            str(params.smoothing),
            "-t",
            "2",
            str(input_path),
        ]
        subprocess.run(cmd, check=True, capture_output=True, text=True)

        with open(output_path) as f:
            return f.read()
