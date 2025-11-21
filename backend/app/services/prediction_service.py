"""
Prediction Service for Medical Image Classification
Handles end-to-end prediction pipeline
"""

import torch
import torch.nn.functional as F
from typing import Dict, Any, Tuple
import logging
from PIL import Image
import time

from ..models.model_loader import get_model_loader
from .preprocessing_service import get_preprocessing_service
from .gradcam_service import get_gradcam_service

logger = logging.getLogger(__name__)

class PredictionService:
    """Service for medical image prediction"""
    
    def __init__(self):
        """Initialize prediction service"""
        self.model_loader = get_model_loader()
        self.preprocessing_service = get_preprocessing_service()
        self.model = None
        self.gradcam_service = None
        self.class_names = ['Normal', 'Pneumonia']
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        logger.info(f"PredictionService initialized on {self.device}")
    
    def load_model(self):
        """Load model and initialize services"""
        if self.model is None:
            self.model = self.model_loader.get_model()
            self.gradcam_service = get_gradcam_service(self.model)
            logger.info("Model loaded and services initialized")
    
    async def predict_from_bytes(
        self, 
        image_bytes: bytes,
        generate_explanation: bool = True
    ) -> Dict[str, Any]:
        """
        Predict from image bytes
        
        Args:
            image_bytes: Raw image bytes
            generate_explanation: Whether to generate GradCAM explanation
            
        Returns:
            dict: Prediction results with explanation
        """
        start_time = time.time()
        
        try:
            # Ensure model is loaded
            self.load_model()
            
            # Validate image
            if not self.preprocessing_service.validate_image(image_bytes):
                raise ValueError("Invalid image format or content")
            
            # Load and preprocess image
            original_image, resized_image = self.preprocessing_service.load_image_from_bytes(
                image_bytes
            )
            
            # Preprocess for model
            image_tensor = self.preprocessing_service.preprocess_for_model(resized_image)
            image_tensor = image_tensor.to(self.device)
            
            # Make prediction
            with torch.no_grad():
                logits, attention_weights, _ = self.model(image_tensor)
                probabilities = F.softmax(logits, dim=1)
                predicted_class = torch.argmax(probabilities, dim=1).item()
                confidence = probabilities[0, predicted_class].item()
            
            # Prepare base response
            response = {
                'success': True,
                'prediction': int(predicted_class),
                'class_name': self.class_names[predicted_class],
                'confidence': float(confidence),
                'probabilities': {
                    name: float(prob)
                    for name, prob in zip(self.class_names, probabilities[0].cpu().tolist())
                },
                'inference_time_ms': 0  # Will be updated
            }
            
            # Generate explanation if requested
            if generate_explanation and self.gradcam_service:
                explanation_data = self.gradcam_service.generate_explanation(
                    original_image,
                    image_tensor,
                    predicted_class,
                    confidence,
                    self.class_names
                )
                response.update(explanation_data)
            
            # Calculate total time
            total_time = (time.time() - start_time) * 1000
            response['inference_time_ms'] = round(total_time, 2)
            
            logger.info(
                f"Prediction: {self.class_names[predicted_class]} "
                f"({confidence*100:.1f}%) in {total_time:.0f}ms"
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information"""
        self.load_model()
        
        model_info = self.model_loader.get_model_info()
        
        return {
            'model_type': 'Hybrid CNN-Transformer',
            'architecture': {
                'backbone_cnn': 'EfficientNet-B0',
                'transformer': 'Vision Transformer (ViT)',
                'fusion_method': 'Cross-Attention',
                'parameters': '15.6M'
            },
            'performance': {
                'accuracy': '95.99%',
                'precision': '96.00%',
                'recall': '97.95%',
                'f1_score': '95.98%',
                'specificity': '92.74%',
                'sensitivity': '97.95%',
                'auc_roc': '0.99'
            },
            'training_info': model_info,
            'classes': self.class_names,
            'device': str(self.device)
        }
    
    def batch_predict(
        self, 
        image_bytes_list: list,
        generate_explanations: bool = False
    ) -> list:
        """
        Batch prediction for multiple images
        
        Args:
            image_bytes_list: List of image bytes
            generate_explanations: Generate explanations for all
            
        Returns:
            list: List of prediction results
        """
        results = []
        
        for i, image_bytes in enumerate(image_bytes_list):
            try:
                result = self.predict_from_bytes(
                    image_bytes, 
                    generate_explanations
                )
                results.append(result)
                logger.info(f"Batch prediction {i+1}/{len(image_bytes_list)} completed")
                
            except Exception as e:
                logger.error(f"Batch prediction {i+1} failed: {e}")
                results.append({
                    'success': False,
                    'error': str(e)
                })
        
        return results

# Global service instance
_prediction_service = None

def get_prediction_service() -> PredictionService:
    """Get singleton prediction service"""
    global _prediction_service
    if _prediction_service is None:
        _prediction_service = PredictionService()
    return _prediction_service
