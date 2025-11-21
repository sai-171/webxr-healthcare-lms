from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict
import logging
import time
from contextlib import asynccontextmanager

from .services.medical_image_service import get_medical_image_service
from .services.prediction_service import get_prediction_service
from .models.model_loader import get_model_loader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Healthcare AR Platform...")

    try:
        model_loader = get_model_loader()
        model_loader.load_model()
        logger.info("Medical image classifier loaded successfully")
        yield

    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

    finally:
        logger.info("Shutting down services...")

app = FastAPI(
    title="Healthcare AR Learning Platform API",
    description="Medical Image Classification API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{time.time() - start:.3f}"
    return response

@app.get("/")
async def root():
    return {
        "message": "Healthcare AR Learning Platform API",
        "version": "2.0.0",
        "status": "operational",
        "features": ["Medical Image Classification", "AR Visualization"],
    }

@app.get("/api/health")
async def health_check():
    try:
        medical_service = get_medical_image_service()
        status = medical_service.get_system_status()
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "services": {
                "medical_image_analysis": status,
                "ar_visualization": "active",
            },
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(status_code=503, content={"status": "unhealthy", "error": str(e)})

@app.post("/api/medical/predict")
async def predict_medical_image(file: UploadFile = File(...), generate_explanation: bool = True):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    medical_service = get_medical_image_service()
    result = await medical_service.analyze_image(file=file, generate_explanation=generate_explanation)
    return result

@app.post("/api/medical/batch-predict")
async def batch_predict_medical_images(files: List[UploadFile] = File(...), generate_explanations: bool = False):
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per batch")
    medical_service = get_medical_image_service()
    results = await medical_service.batch_analyze(files=files, generate_explanations=generate_explanations)
    return {"success": True, "total_files": len(files), "results": results}

@app.get("/api/medical/model-info")
async def get_model_information():
    try:
        prediction_service = get_prediction_service()
        model_info = prediction_service.get_model_info()
        return model_info
    except Exception as e:
        logger.error(f"Failed to get model info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/medical/capabilities")
async def get_medical_capabilities():
    try:
        medical_service = get_medical_image_service()
        capabilities = medical_service.get_capabilities()
        return capabilities
    except Exception as e:
        logger.error(f"Failed to get capabilities: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": exc.detail, "status_code": exc.status_code},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"},
    )

if __name__ == "__main__":
    import uvicorn

    print("=" * 70)
    print("Healthcare AR Learning Platform - Backend Server")
    print("=" * 70)
    print("Medical Image Classification: ENABLED")
    print("AR Visualization: ENABLED")
    print("=" * 70)
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/api/health")
    print("=" * 70)

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
