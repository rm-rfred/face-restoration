from fastapi import APIRouter

from app.api.endpoints import download, face_restoration

api_router = APIRouter()
api_router.include_router(download.router, prefix="/download", tags=["download"])
api_router.include_router(face_restoration.router, prefix="/face_restoration", tags=["face_restoration"])
