import type { HeartAnnotation } from '../types';

export const heartAnnotations: HeartAnnotation[] = [
  {
    id: 'right-atrium',
    position: [1.5, 0.6, 0.4],
    title: 'Right Atrium',
    description: 'Upper right chamber that receives deoxygenated blood from the body',
    detailedInfo: 'The right atrium is one of the four chambers of the heart. It receives deoxygenated blood returning from the body through the superior and inferior vena cavae.',
    type: 'chamber',
    color: '#3B82F6',
    medicalTerms: ['Atrium dexter', 'Right auricle'],
    functions: [
      'Receives deoxygenated blood from systemic circulation',
      'Contains the sinoatrial (SA) node - natural pacemaker'
    ],
    relatedStructures: ['tricuspid-valve'],
    clinicalSignificance: 'Atrial fibrillation commonly affects this chamber'
  },
  {
    id: 'left-atrium',
    position: [-1.5, 0.6, 0.4],
    title: 'Left Atrium',
    description: 'Upper left chamber that receives oxygenated blood from the lungs',
    detailedInfo: 'The left atrium receives oxygenated blood from the lungs via four pulmonary veins.',
    type: 'chamber',
    color: '#EF4444',
    medicalTerms: ['Atrium sinister', 'Left auricle'],
    functions: [
      'Receives oxygenated blood from pulmonary circulation',
      'Maintains higher pressure than right atrium'
    ],
    relatedStructures: ['mitral-valve'],
    clinicalSignificance: 'Common site for atrial fibrillation'
  },
  {
    id: 'right-ventricle',
    position: [1.2, -0.6, 0.3],
    title: 'Right Ventricle',
    description: 'Lower right chamber that pumps blood to the lungs',
    detailedInfo: 'The right ventricle pumps deoxygenated blood through the pulmonary valve.',
    type: 'chamber',
    color: '#8B5CF6',
    medicalTerms: ['Ventriculus dexter'],
    functions: [
      'Pumps blood to pulmonary circulation',
      'Generates pressure for lung circulation'
    ],
    relatedStructures: ['pulmonary-valve'],
    clinicalSignificance: 'Right heart failure affects pulmonary circulation'
  },
  {
    id: 'left-ventricle',
    position: [-1.2, -0.6, 0.3],
    title: 'Left Ventricle',
    description: 'Main pumping chamber that sends blood to the entire body',
    detailedInfo: 'The left ventricle is the heart\'s main pumping chamber with the thickest walls.',
    type: 'chamber',
    color: '#DC2626',
    medicalTerms: ['Ventriculus sinister'],
    functions: [
      'Main pump for systemic circulation',
      'Generates highest pressure in heart'
    ],
    relatedStructures: ['aortic-valve'],
    clinicalSignificance: 'Left heart failure is most common'
  },
  {
    id: 'aortic-valve',
    position: [-0.8, 0.1, 1.0],
    title: 'Aortic Valve',
    description: 'Valve between left ventricle and aorta',
    detailedInfo: 'The aortic valve prevents backflow from the aorta.',
    type: 'valve',
    color: '#F59E0B',
    medicalTerms: ['Valva aortae'],
    functions: [
      'Prevents aortic regurgitation',
      'Ensures unidirectional blood flow'
    ],
    relatedStructures: ['left-ventricle'],
    clinicalSignificance: 'Aortic stenosis requires intervention'
  },
  {
    id: 'pulmonary-valve',
    position: [0.8, 0.1, 1.0],
    title: 'Pulmonary Valve',
    description: 'Valve between right ventricle and pulmonary artery',
    detailedInfo: 'The pulmonary valve controls blood flow to the lungs.',
    type: 'valve',
    color: '#10B981',
    medicalTerms: ['Valva pulmonalis'],
    functions: [
      'Controls flow to pulmonary circulation',
      'Prevents pulmonary regurgitation'
    ],
    relatedStructures: ['right-ventricle'],
    clinicalSignificance: 'Pulmonary stenosis often congenital'
  }
];

export const annotationLevels = {
  basic: ['right-atrium', 'left-atrium', 'right-ventricle', 'left-ventricle'],
  intermediate: ['right-atrium', 'left-atrium', 'right-ventricle', 'left-ventricle', 'aortic-valve', 'pulmonary-valve'],
  advanced: heartAnnotations.map(a => a.id)
};

export default heartAnnotations;
