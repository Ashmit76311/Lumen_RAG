"""
Main FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from src.api.routes import router
from src.auth.routes import router as auth_router

app = FastAPI(title="Adaptive RAG API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router)
app.state.description_ = ""


@app.get("/")
async def root():
    """Root endpoint to verify API is running."""
    return {"message": "Adaptive RAG API is running"}
