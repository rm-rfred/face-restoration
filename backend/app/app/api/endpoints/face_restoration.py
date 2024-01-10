from io import BytesIO
import pickle
import tempfile

import cv2
from fastapi import APIRouter, File, Form
from fastapi.responses import Response
from simber import Logger

from app.utils.grpc_client import GrpcClient

LOG_FORMAT = "{levelname} [{filename}:{lineno}]:"

LOG_LEVEL: str = "INFO"
logger = Logger(__name__, log_path="/tmp/logs/server.log", level=LOG_LEVEL)
logger.update_format(LOG_FORMAT)

router = APIRouter()

@router.get("/", status_code=200)
def hello_world():
    return {"message": "Hello World"}


@router.post("/restore", status_code=200)
async def post_image(
    endpoint: str = "face-restoration-worker:13000",
    file: bytes = File(...),
    background_enhance: bool = Form(...),
    face_upsample: bool = Form(...),
    upscale: int = Form(...),
    codeformer_fidelity: float = Form(...),
    timeout: int = 60,
):
    with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as temp_file:
        temp_file.write(file)
        temp_file.flush()
        temp_file_path = temp_file.name

        image = cv2.imread(temp_file_path)

    response = GrpcClient.get_face_restoration_from_grpc(
        endpoint,
        pickle.dumps(image),
        background_enhance=background_enhance,
        face_upsample=face_upsample,
        upscale=upscale,
        codeformer_fidelity=codeformer_fidelity,
        timeout=timeout,
    )

    _, buffer = cv2.imencode(".jpg", pickle.loads(response))
    io_buffer = BytesIO(buffer)
    io_buffer.seek(0)

    return Response(io_buffer.read(), media_type="image/jpeg")
