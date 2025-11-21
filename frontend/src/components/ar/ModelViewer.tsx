import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { Group, Mesh, Material, Box3, Vector3 } from 'three';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string;
  onModelLoaded?: (loaded: boolean, modelInfo?: ModelInfo) => void;
  onError?: (error: string) => void;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
  enableAutoCenter?: boolean;
  enableAutoScale?: boolean;
  showWireframe?: boolean;
  materialOverride?: {
    color?: string;
    metalness?: number;
    roughness?: number;
  };
}

interface ModelInfo {
  boundingBox: Box3;
  meshCount: number;
  vertexCount: number;
  triangleCount: number;
  materialCount: number;
  hasAnimations: boolean;
  animationNames: string[];
  fileSize?: number;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelPath,
  onModelLoaded,
  onError,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate = false,
  enableAutoCenter = true,
  enableAutoScale = true,
  showWireframe = false,
  materialOverride
}) => {
  const groupRef = useRef<Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  const { scene: threeScene } = useThree();

  // Load GLTF model with comprehensive error handling
  const { scene, nodes, materials, animations, error } = useGLTF(
    modelPath,
    true, // Use Draco loader if available
    (loader) => {
      // Configure loader
      loader.setDRACOLoader = loader.setDRACOLoader || (() => {});
    }
  );

  // Calculate model information
  const calculateModelInfo = useCallback((modelScene: THREE.Group): ModelInfo => {
    const boundingBox = new Box3().setFromObject(modelScene);
    let meshCount = 0;
    let vertexCount = 0;
    let triangleCount = 0;
    const materialSet = new Set();

    modelScene.traverse((child) => {
      if (child instanceof Mesh) {
        meshCount++;
        
        if (child.geometry) {
          const positionAttribute = child.geometry.getAttribute('position');
          if (positionAttribute) {
            vertexCount += positionAttribute.count;
            triangleCount += positionAttribute.count / 3;
          }
        }

        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => materialSet.add(mat.uuid));
          } else {
            materialSet.add(child.material.uuid);
          }
        }
      }
    });

    return {
      boundingBox,
      meshCount,
      vertexCount: Math.floor(vertexCount),
      triangleCount: Math.floor(triangleCount),
      materialCount: materialSet.size,
      hasAnimations: animations && animations.length > 0,
      animationNames: animations ? animations.map(anim => anim.name) : []
    };
  }, [animations]);

  // Handle successful model loading
  useEffect(() => {
    if (scene && !error && !loadingError) {
      console.log('🎯 Model loaded successfully:', modelPath);
      
      try {
        // Calculate model information
        const info = calculateModelInfo(scene);
        setModelInfo(info);
        
        console.log('📊 Model Info:', {
          meshes: info.meshCount,
          vertices: info.vertexCount.toLocaleString(),
          triangles: info.triangleCount.toLocaleString(),
          materials: info.materialCount,
          animations: info.animationNames
        });

        // Configure model properties
        scene.traverse((child) => {
          if (child instanceof Mesh) {
            // Enable shadows
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Configure materials
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              
              materials.forEach((material: Material) => {
                // Apply material overrides
                if (materialOverride && 'color' in material) {
                  if (materialOverride.color && 'color' in material) {
                    (material as any).color = new THREE.Color(materialOverride.color);
                  }
                  if (materialOverride.metalness !== undefined && 'metalness' in material) {
                    (material as any).metalness = materialOverride.metalness;
                  }
                  if (materialOverride.roughness !== undefined && 'roughness' in material) {
                    (material as any).roughness = materialOverride.roughness;
                  }
                }
                
                // Enable wireframe if requested
                if (showWireframe && 'wireframe' in material) {
                  (material as any).wireframe = showWireframe;
                }
                
                // Ensure proper material configuration
                material.needsUpdate = true;
                
                // Enable transparency if needed
                if ('transparent' in material && 'opacity' in material) {
                  const mat = material as any;
                  if (mat.opacity < 1.0) {
                    mat.transparent = true;
                  }
                }
              });
            }
          }
        });

        setModelLoaded(true);
        setLoadingError(null);
        onModelLoaded?.(true, info);
        
      } catch (processingError) {
        console.error('❌ Model processing error:', processingError);
        const errorMessage = processingError instanceof Error 
          ? processingError.message 
          : 'Failed to process model';
        setLoadingError(errorMessage);
        onError?.(errorMessage);
      }
    }
  }, [scene, error, loadingError, modelPath, onModelLoaded, onError, calculateModelInfo, showWireframe, materialOverride]);

  // Handle model loading errors
  useEffect(() => {
    if (error) {
      console.error('❌ Model loading error:', error);
      const errorMessage = error instanceof Error 
        ? `GLB Load Error: ${error.message}` 
        : 'Unknown GLB loading error';
      
      setLoadingError(errorMessage);
      setModelLoaded(false);
      onError?.(errorMessage);
      onModelLoaded?.(false);
    }
  }, [error, onError, onModelLoaded]);

  // Auto-rotation animation
  useFrame((state, delta) => {
    if (groupRef.current && modelLoaded && autoRotate) {
      groupRef.current.rotation.y += delta * 0.2; // Smooth rotation
    }
  });

  // Apply transformations when props change
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.set(...position);
      groupRef.current.rotation.set(...rotation);
    }
  }, [scale, position, rotation]);

  // Auto-center and auto-scale the model
  const renderModel = () => {
    if (!scene) return null;

    const modelElement = <primitive object={scene.clone()} />;

    if (enableAutoCenter && enableAutoScale) {
      return (
        <Bounds fit clip observe margin={1.2}>
          <Center>
            {modelElement}
          </Center>
        </Bounds>
      );
    } else if (enableAutoCenter) {
      return (
        <Center>
          {modelElement}
        </Center>
      );
    }

    return modelElement;
  };

  // Error fallback with detailed information
  if (loadingError || error || !scene) {
    const errorMsg = loadingError || (error?.message) || 'Model not available';
    
    return (
      <group ref={groupRef}>
        {/* Fallback geometry - Heart shape */}
        <group position={[0, 0, 0]}>
          {/* Heart top spheres */}
          <mesh position={[-0.6, 0.8, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
          <mesh position={[0.6, 0.8, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
          
          {/* Heart bottom point */}
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.8, 1.5, 8]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
          
          {/* Error indicator */}
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#f39c12" />
          </mesh>
        </group>

        {/* Error text (visible in dev) */}
        {process.env.NODE_ENV === 'development' && (
          <group position={[0, -2, 0]}>
            <mesh>
              <boxGeometry args={[4, 0.5, 0.1]} />
              <meshBasicMaterial color="#34495e" transparent opacity={0.8} />
            </mesh>
          </group>
        )}
      </group>
    );
  }

  // Successful render
  return (
    <group ref={groupRef} dispose={null}>
      {renderModel()}
    </group>
  );
};

// Utility functions for model management
export const ModelUtils = {
  // Preload a model
  preloadModel: (path: string) => {
    return useGLTF.preload(path);
  },

  // Get model info without rendering
  getModelInfo: async (path: string): Promise<ModelInfo | null> => {
    try {
      const { scene, animations } = await useGLTF.preload(path);
      const boundingBox = new Box3().setFromObject(scene);
      let meshCount = 0;
      let vertexCount = 0;
      const materialSet = new Set();

      scene.traverse((child) => {
        if (child instanceof Mesh) {
          meshCount++;
          if (child.geometry) {
            const positionAttribute = child.geometry.getAttribute('position');
            if (positionAttribute) {
              vertexCount += positionAttribute.count;
            }
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => materialSet.add(mat.uuid));
            } else {
              materialSet.add(child.material.uuid);
            }
          }
        }
      });

      return {
        boundingBox,
        meshCount,
        vertexCount,
        triangleCount: Math.floor(vertexCount / 3),
        materialCount: materialSet.size,
        hasAnimations: animations.length > 0,
        animationNames: animations.map(anim => anim.name)
      };
    } catch (error) {
      console.error('Failed to get model info:', error);
      return null;
    }
  },

  // Clear model cache
  clearCache: () => {
    useGLTF.clear();
  }
};

// Export types for use in parent components
export type { ModelInfo };
