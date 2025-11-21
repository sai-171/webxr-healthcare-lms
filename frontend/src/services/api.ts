const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface PredictMedicalImageResponse {
  class_name: string;
  confidence: number;
  explanation_url?: string;
  [key: string]: any;
}

// Upload medical image for prediction
export async function predictMedicalImage(file: File, generateExplanation = true): Promise<PredictMedicalImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Send generate_explanation as a query parameter, not form data
  const url = `${API_BASE_URL}/api/medical/predict?generate_explanation=${generateExplanation}`;

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
