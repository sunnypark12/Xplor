import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
  position?: [number, number, number];
  scale?: number;
}

const Earth: React.FC<EarthProps> = ({ position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a simple earth texture using canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create gradient background (ocean)
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#1e3a8a'); // Deep blue
    gradient.addColorStop(1, '#0ea5e9'); // Light blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add continents (simplified shapes)
    ctx.fillStyle = '#22c55e'; // Green for land
    ctx.beginPath();
    
    // North America
    ctx.ellipse(200, 150, 80, 60, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America
    ctx.ellipse(250, 300, 40, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Europe
    ctx.ellipse(500, 120, 60, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Africa
    ctx.ellipse(520, 250, 50, 100, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Asia
    ctx.ellipse(700, 150, 120, 80, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Australia
    ctx.ellipse(800, 350, 60, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
      <meshStandardMaterial map={earthTexture} />
    </Sphere>
  );
};

export default Earth;