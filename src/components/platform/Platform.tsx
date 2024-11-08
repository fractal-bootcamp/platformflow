import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges, Points, PointMaterial } from '@react-three/drei'
import { useStore } from '../../lib/store/editorStore'
import type { PlatformProps } from '../../types/editor'
import * as THREE from 'three'
import { SelectionCage } from './SelectionCage'

export const Platform = ({ id, position, size, title, index }: PlatformProps) => {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const setSelectedPlatform = useStore(state => state.setSelectedPlatform)
  const colors = useStore(state => state.colors)
  const debug = useStore(state => state.debug)

  const getPlatformColor = () => {
    if (colors.useSameColor) {
      return colors.platform1Color
    }
    switch (index) {
      case 0:
        return colors.platform1Color
      case 1:
        return colors.platform2Color
      case 2:
        return colors.platform3Color
      default:
        return '#ffffff'
    }
  }

  const getHoverColor = () => {
    const color = getPlatformColor()
    return color.replace(/^#/, '').match(/.{2}/g)?.map(hex => {
      const val = Math.min(255, Math.floor(parseInt(hex, 16) * 1.2))
      return val.toString(16).padStart(2, '0')
    }).join('') || '#ffffff'
  }

  useFrame(() => {
    if (!meshRef.current) return
    if (hovered) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.05
    } else {
      meshRef.current.position.y = position[1]
    }
  })

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={size}
        radius={0.05}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setSelectedPlatform(id)}
        castShadow={debug.showDebug}
        receiveShadow={debug.showDebug}
        visible={debug.showMesh}
      >
        <meshStandardMaterial
          color={hovered ? getHoverColor() : getPlatformColor()}
          metalness={0.2}
          roughness={0.8}
        />
        
        {/* Debug Edges */}
        {debug.showEdges && (
          <Edges
            threshold={15}
            color="#ffffff"
            scale={1.001}
          />
        )}
        
        {/* Debug Points */}
        {debug.showPoints && (
          <Points limit={20}>
            <PointMaterial
              transparent
              vertexColors
              size={15}
              sizeAttenuation={false}
              depthWrite={false}
            />
          </Points>
        )}
      </RoundedBox>
      
      <SelectionCage platform={{ id, position, size, title }} />
    </group>
  )
} 