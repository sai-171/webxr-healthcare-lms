const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface PredictMedicalImageResponse {
  class_name: string;
  confidence: number;
  explanation_url?: string;
  [key: string]: any;
}

/**
 * Uploads a medical image for prediction using the specified model.
 * @param file - Image file (usually from file input).
 * @param modelType - 'mobilenetv2' (default/lightweight) or 'hybrid_cnn_vit' (advanced/experimental).
 * @param generateExplanation - If true, requests a GradCAM/heatmap from the API (hybrid only).
 */
export async function predictMedicalImage(
  file: File,
  modelType: 'mobilenetv2' | 'hybrid_cnn_vit' = 'mobilenetv2',
  generateExplanation = true
): Promise<PredictMedicalImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Add both query parameters
  const url = `${API_BASE_URL}/api/medical/predict?generate_explanation=${generateExplanation}&model_type=${modelType}`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Prediction API error: ${errorText}`);
  }

  const data = await response.json();
  return data as PredictMedicalImageResponse;
}
