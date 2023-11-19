from fastapi import APIRouter

from app.api.endpoints import face_restoration

api_router = APIRouter()
api_router.include_router(face_restoration.router, prefix="/face_restoration", tags=["face_restoration"])
