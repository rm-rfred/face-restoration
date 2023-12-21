import tempfile

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import Response
from simber import Logger

router = APIRouter()

LOG_FORMAT = "{levelname} [{filename}:{lineno}]:"

LOG_LEVEL: str = "INFO"
logger = Logger(__name__, log_path="/tmp/logs/server.log", level=LOG_LEVEL)
logger.update_format(LOG_FORMAT)

@router.post("/download", status_code=200)
async def download(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file.file.read())

        with open(temp_file.name, "rb") as temp_file:
            content = temp_file.read()
            response = Response(content, media_type="application/octet-stream")
            response.headers["Content-Disposition"] = 'attachment; filename="restored_face.jpeg"'
        
            return response
    except Exception as e:
        logger.error(e)