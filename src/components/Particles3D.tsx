import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  flashTimer?: number;
}

interface ExplosionDebris {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

export function Particles3D({ 
    particlesRef, 
    debrisRef, 
    width, 
    height 
}: { 
    particlesRef: React.MutableRefObject<Particle[]>,
    debrisRef: React.MutableRefObject<ExplosionDebris[]>,
    width: number,
    height: number
}) {
    return (
        <Canvas camera={{ position: [width / 2, height / 2, width * 1.5], fov: 60 }} className="w-full h-full">
            <ambientLight intensity={0.5} />
            <pointLight position={[width, height, width]} intensity={1.5} />
            
            <InstancedParticles particlesRef={particlesRef} width={width} height={height} />
            <InstancedDebris debrisRef={debrisRef} width={width} height={height} />
            
            <OrbitControls target={[width / 2, height / 2, 0]} enableDamping={true} />
            <BoxOutline width={width} height={height} />
        </Canvas>
    );
}

function BoxOutline({ width, height }: { width: number, height: number }) {
    const boxRef = useRef<THREE.LineSegments>(null);

    useMemo(() => {
        if (!boxRef.current) return;
        const geometry = new THREE.BoxGeometry(width, height, width);
        const edges = new THREE.EdgesGeometry(geometry);
        boxRef.current.geometry = edges;
    }, [width, height]);

    return (
        <lineSegments ref={boxRef} position={[width/2, height/2, 0]}>
            <lineBasicMaterial color="#334155" />
        </lineSegments>
    );
}

function InstancedParticles({ particlesRef, width, height }: { particlesRef: React.MutableRefObject<Particle[]>, width: number, height: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colorObject = useMemo(() => new THREE.Color(), []);

    useFrame(() => {
        if (!meshRef.current) return;
        const particles = particlesRef.current;
        const count = particles.length;
        
        meshRef.current.count = count;

        for (let i = 0; i < count; i++) {
            const p = particles[i];
            
            dummy.position.set(p.x, p.y, p.z);
            dummy.scale.set(p.radius, p.radius, p.radius);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            if (p.flashTimer && p.flashTimer > 0) {
                colorObject.set('#fbbf24');
            } else {
                colorObject.set(p.color);
            }
            meshRef.current.setColorAt(i, colorObject);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 4000]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial />
        </instancedMesh>
    );
}

function InstancedDebris({ debrisRef, width, height }: { debrisRef: React.MutableRefObject<ExplosionDebris[]>, width: number, height: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colorObject = useMemo(() => new THREE.Color(), []);

    useFrame(() => {
        if (!meshRef.current) return;
        const debris = debrisRef.current;
        const count = debris.length;
        
        meshRef.current.count = count;

        for (let i = 0; i < count; i++) {
            const d = debris[i];
            
            dummy.position.set(d.x, d.y, d.z);
            dummy.scale.set(d.radius, d.radius, d.radius);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            colorObject.set(d.color);
            meshRef.current.setColorAt(i, colorObject);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 1000]}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial emissive="#fbbf24" emissiveIntensity={2} />
        </instancedMesh>
    );
}
