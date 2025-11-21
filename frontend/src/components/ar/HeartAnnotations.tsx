import React, { useState, useRef, useCallback } from 'react';
import { Html, Sphere, Line } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Vector3, Color } from 'three';
import type { HeartAnnotation } from '../../types';
import { heartAnnotations, annotationLevels } from '../../data/heartAnnotations';
import * as THREE from 'three';

interface AnnotationMarkerProps {
  annotation: HeartAnnotation;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  showLabel: boolean;
  visited: boolean;
}

const AnnotationMarker: React.FC<AnnotationMarkerProps> = ({
  annotation,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  showLabel,
  visited
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current && !isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      sphereRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    console.log(`🎯 Clicked annotation: ${annotation.title}`);
    onSelect(annotation.id);
  }, [annotation.id, onSelect]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(annotation.id);
    document.body.style.cursor = 'pointer';
  }, [annotation.id, onHover]);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = 'default';
  }, [onHover]);

  const getTypeIcon = () => {
    switch (annotation.type) {
      case 'chamber': return '🫀';
      case 'valve': return '🚪';
      case 'vessel': return '🩸';
      default: return '📍';
    }
  };

  const markerColor = new Color(annotation.color);
  const opacity = isSelected ? 0.9 : isHovered ? 0.8 : 0.7;

  const labelStyle: React.CSSProperties = { pointerEvents: 'none' };

  return (
    <group position={annotation.position}>
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(-annotation.position[0] * 0.3, -annotation.position[1] * 0.3, -annotation.position[2] * 0.3)]}
        color={annotation.color}
        lineWidth={isSelected ? 3 : isHovered ? 2 : 1}
        transparent
        opacity={0.3}
      />

      <Sphere
        ref={sphereRef}
        args={[0.06]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          color={markerColor}
          transparent
          opacity={opacity}
          toneMapped={false}
        />
      </Sphere>

      <Sphere args={[0.1]}>
        <meshBasicMaterial
          color={markerColor}
          transparent
          opacity={isSelected ? 0.4 : isHovered ? 0.3 : 0.15}
          toneMapped={false}
        />
      </Sphere>

      {visited && !isSelected && (
        <Sphere args={[0.04]} position={[0.08, 0.08, 0]}>
          <meshBasicMaterial color="#22C55E" toneMapped={false} />
        </Sphere>
      )}

      {(showLabel || isHovered) && (
        <Html
          position={[0, 0.15, 0]}
          center
          distanceFactor={8}
          occlude={false}
          style={labelStyle}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-gray-700 whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <span className="text-base">{getTypeIcon()}</span>
              <div>
                <div className="font-semibold">{annotation.title}</div>
                <div className="text-gray-300 text-xs">{annotation.type}</div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

interface HeartAnnotationsProps {
  selectedAnnotationId: string | null;
  onAnnotationSelect: (id: string | null) => void;
  showAllLabels: boolean;
  annotationLevel: 'basic' | 'intermediate' | 'advanced';
  visitedAnnotations: Set<string>;
}

export const HeartAnnotations: React.FC<HeartAnnotationsProps> = ({
  selectedAnnotationId,
  onAnnotationSelect,
  showAllLabels,
  annotationLevel,
  visitedAnnotations
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getVisibleAnnotations = useCallback(() => {
    return heartAnnotations.filter(annotation => 
      annotationLevels[annotationLevel].includes(annotation.id)
    );
  }, [annotationLevel]);

  const visibleAnnotations = getVisibleAnnotations();
  const selectedAnnotation = heartAnnotations.find(a => a.id === selectedAnnotationId);

  return (
    <>
      {visibleAnnotations.map((annotation) => (
        <AnnotationMarker
          key={annotation.id}
          annotation={annotation}
          isSelected={selectedAnnotationId === annotation.id}
          isHovered={hoveredId === annotation.id}
          onSelect={onAnnotationSelect}
          onHover={setHoveredId}
          showLabel={showAllLabels}
          visited={visitedAnnotations.has(annotation.id)}
        />
      ))}

      {selectedAnnotation && (
        <Html position={[0, 0, 0]} transform={false}>
          <div className="absolute top-5 right-5 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm w-80 z-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg shadow-lg"
                  style={{ backgroundColor: selectedAnnotation.color }}
                >
                  {selectedAnnotation.type === 'chamber' ? '🫀' : 
                   selectedAnnotation.type === 'valve' ? '🚪' : '🩸'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {selectedAnnotation.title}
                  </h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {selectedAnnotation.type}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnnotationSelect(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close annotation"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedAnnotation.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  📖 Functions
                </h4>
                <ul className="space-y-1">
                  {selectedAnnotation.functions.slice(0, 2).map((func, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-primary-600 mr-2 mt-1">•</span>
                      <span className="flex-1">{func}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-2">
                  🏥 Medical Terms
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedAnnotation.medicalTerms.slice(0, 3).map((term, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              {selectedAnnotation.clinicalSignificance && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-800 text-sm mb-1">
                    🏥 Clinical Note
                  </h4>
                  <p className="text-blue-700 text-xs">
                    {selectedAnnotation.clinicalSignificance}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </>
  );
};
