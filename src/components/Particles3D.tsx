import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Instances, Instance, Text, Billboard } from '@react-three/drei';
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

interface EnergyPopup {
  id: number;
  x: number;
  y: number;
  z: number;
  energy: number;
  life: number;
}

export function Particles3D({ 
    particlesRef, 
    debrisRef, 
    popupsRef,
    width, 
    height,
    autoRotate = false,
    productName,
    showProduct,
    productColor
}: { 
    particlesRef: React.MutableRefObject<Particle[]>,
    debrisRef: React.MutableRefObject<ExplosionDebris[]>,
    popupsRef?: React.MutableRefObject<EnergyPopup[]>,
    width: number,
    height: number,
    autoRotate?: boolean,
    productName?: string,
    showProduct?: boolean,
    productColor?: string
}) {
    return (
        <Canvas camera={{ position: [width / 2, height / 2, width * 1.5], fov: 60 }} className="w-full h-full">
            <ambientLight intensity={0.5} />
            <pointLight position={[width, height, width]} intensity={1.5} />
            
            <InstancedParticles particlesRef={particlesRef} width={width} height={height} />
            <InstancedDebris debrisRef={debrisRef} width={width} height={height} />
            {popupsRef && <ActivePopups popupsRef={popupsRef} />}
            
            {showProduct && productName && (
                <Billboard position={[width / 2, height + width/4 + 40, 0]}>
                    <Text 
                        fontSize={20}
                        fontWeight="bold"
                        color={productColor || "#38bdf8"}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={2}
                        outlineColor="#0f172a"
                    >
                        {productName}
                    </Text>
                </Billboard>
            )}

            <OrbitControls target={[width / 2, height / 2, 0]} enableDamping={true} autoRotate={autoRotate} autoRotateSpeed={2} />
            <TestTubeOutline width={width} height={height} />
        </Canvas>
    );
}

function ActivePopups({ popupsRef }: { popupsRef: React.MutableRefObject<EnergyPopup[]> }) {
    const [popups, setPopups] = useState<EnergyPopup[]>([]);
    
    useFrame(() => {
        // Debounce state updates by only synchronizing length or new ids
        if (popupsRef.current.length !== popups.length) {
            setPopups([...popupsRef.current]);
        }
    });

    return (
        <>
            {popups.map(p => (
                <PopupItem key={p.id} popup={p} popupsRef={popupsRef} />
            ))}
        </>
    );
}

function PopupItem({ popup, popupsRef }: { popup: EnergyPopup, popupsRef: React.MutableRefObject<EnergyPopup[]> }) {
    const textRef = useRef<any>(null);
    const billboardRef = useRef<any>(null);
    
    useFrame(() => {
        if (!textRef.current || !billboardRef.current) return;
        const current = popupsRef.current.find(p => p.id === popup.id);
        if (current) {
            billboardRef.current.position.set(current.x, current.y, current.z);
            textRef.current.fillOpacity = Math.max(0, current.life);
            textRef.current.outlineOpacity = Math.max(0, current.life);
        } else {
            textRef.current.fillOpacity = 0;
            textRef.current.outlineOpacity = 0;
        }
    });

    return (
        <Billboard ref={billboardRef} position={[popup.x, popup.y, popup.z]}>
            <Text
                ref={textRef}
                fontSize={16}
                color="#f43f5e"
                anchorX="center"
                anchorY="middle"
                outlineWidth={2}
                outlineColor="#000000"
                font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
            >
                {`+${(popup.energy * 10).toFixed(1)} kJ`}
            </Text>
        </Billboard>
    );
}

function TestTubeOutline({ width, height }: { width: number, height: number }) {
    const radius = width * 0.75;
    return (
        <group position={[width / 2, height / 2, 0]}>
            {/* Test tube glass body */}
            <mesh>
                <cylinderGeometry args={[radius, radius, height + width/2, 32, 1, true]} />
                <meshStandardMaterial 
                    color="#e2e8f0" 
                    transparent 
                    opacity={0.15} 
                    roughness={0.1}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Test tube bottom hemisphere */}
            <mesh position={[0, -(height + width/2) / 2, 0]}>
                <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                <meshStandardMaterial 
                    color="#e2e8f0" 
                    transparent 
                    opacity={0.15} 
                    roughness={0.1}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Test tube lip */}
            <mesh position={[0, (height + width/2) / 2, 0]}>
                <torusGeometry args={[radius, width / 30, 16, 32]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.5} />
            </mesh>
        </group>
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
