import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function OptimizedModel({ url, position, rotation = [0, 0, 0], scale, onClick, isClickable = true, isApiProduct = false }) {
  const group = useRef();
  const { scene, materials } = useGLTF(url);
  const [isHovered, setIsHovered] = useState(false);
  const { gl, raycaster, camera, mouse } = useThree();

  const hoverColor = useMemo(() => new THREE.Color('#B7E0FF'), []);
  const isStoreModel = url.includes('store.glb');

  const hideMeshesByName = useMemo(() => (scene, namesToHide) => {
    scene.traverse((object) => {
      if (object.name && namesToHide.some(name => object.name.includes(name))) {
        object.visible = false;
        object.traverse(child => {
          child.visible = false;
        });
      }
    });
  }, []);

  useEffect(() => {
    const clonedScene = scene.clone(true);

    if (isStoreModel) {
      hideMeshesByName(clonedScene, ['Object_69', 'Object_70', 'Object_71', 'Object_83', 'Object_82', 'Object_84']);
    }

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.userData.originalColor = child.material.color.clone();
        child.material.needsUpdate = true;
      }
    });

    if (group.current) {
      group.current.add(clonedScene);
    }

    return () => {
      if (group.current) {
        while (group.current.children.length > 0) {
          const child = group.current.children[0];
          group.current.remove(child);
          if (child.isMesh) {
            child.geometry.dispose();
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      }
    };
  }, [scene, materials, url, isStoreModel, hideMeshesByName]);

  const handlePointerOver = (event) => {
    if (!isClickable || !isApiProduct) return;
    event.stopPropagation();
    setIsHovered(true);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePointerOut = (event) => {
    if (!isClickable || !isApiProduct) return;
    event.stopPropagation();
    setIsHovered(false);
    gl.domElement.style.cursor = 'default';
  };
  
  const handleClick = (event) => {
    if (!isClickable || !isApiProduct) return;
    event.stopPropagation();
    onClick(url);
  };

  useFrame(() => {
    if (group.current) {
      group.current.position.set(...position);
      group.current.rotation.set(...rotation);
      group.current.scale.set(scale[0], scale[1], scale[2]);
    }

    if (group.current && isApiProduct) {
      group.current.traverse((child) => {
        if (child.isMesh) {
          if (isHovered) {
            child.material.emissive.copy(hoverColor);
            child.material.emissiveIntensity = 0.5;
          } else {
            child.material.emissive.set(0, 0, 0);
            child.material.emissiveIntensity = 0;
          }
        }
      });
    }
  });

  return (
    <group 
      ref={group}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

export default OptimizedModel;