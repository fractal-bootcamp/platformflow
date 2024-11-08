import { useMemo, useCallback } from 'react'
import { Vector3 as ThreeVector3, Plane } from 'three'
import { useThree } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import { useStore } from '../../lib/store/editorStore'
import type { Vector3, Platform } from '../../types/editor'
import type { GridLine, SelectionCageGeometry } from '../../types/selectionCage'

interface SelectionCageProps {
  platform: Platform
}

export const SelectionCage = ({ platform }: SelectionCageProps) => {
  const { raycaster } = useThree()
  const selectionCage = useStore(state => state.selectionCage)
  const addSelectionPoint = useStore(state => state.addSelectionPoint)

  const platformSettings = selectionCage.platformSettings[platform.id]

  // Generate grid geometry based on platform dimensions
  const geometry = useMemo<SelectionCageGeometry>(() => {
    if (!platformSettings) return { points: [], lines: [], bounds: { min: [0,0,0], max: [0,0,0] } }
    
    const { xSubdivisions, ySubdivisions, gridOffset } = platformSettings
    const [width, _, depth] = platform.size

    // Calculate grid points
    const points: Vector3[] = []
    const lines: GridLine[] = []
    
    // Generate points grid with proper spacing
    const xStep = width / xSubdivisions
    const zStep = depth / ySubdivisions

    // Generate points only within platform bounds
    for (let x = 0; x <= xSubdivisions; x++) {
      for (let z = 0; z <= ySubdivisions; z++) {
        points.push([
          (x * xStep) - (width / 2),
          gridOffset,
          (z * zStep) - (depth / 2)
        ])
      }
    }

    // Generate grid lines within platform bounds
    // Vertical lines (along Z)
    for (let x = 0; x <= xSubdivisions; x++) {
      const xPos = (x * xStep) - (width / 2)
      lines.push({
        start: [xPos, gridOffset, -depth / 2],
        end: [xPos, gridOffset, depth / 2],
        orientation: 'vertical'
      })
    }

    // Horizontal lines (along X)
    for (let z = 0; z <= ySubdivisions; z++) {
      const zPos = (z * zStep) - (depth / 2)
      lines.push({
        start: [-width / 2, gridOffset, zPos],
        end: [width / 2, gridOffset, zPos],
        orientation: 'horizontal'
      })
    }

    return {
      points,
      lines,
      bounds: {
        min: [-width / 2, gridOffset, -depth / 2],
        max: [width / 2, gridOffset, depth / 2]
      }
    }
  }, [platform.size, platformSettings])

  // Handle point selection with proper position calculation
  const handleClick = useCallback((event: { stopPropagation: () => void }) => {
    event.stopPropagation()
    
    if (!platformSettings) return // Guard against undefined settings
    
    const clickPoint = new ThreeVector3()
    const plane = new Plane(
      new ThreeVector3(0, 1, 0),
      -platformSettings.gridOffset // Use gridOffset from platformSettings
    )
    
    if (raycaster.ray.intersectPlane(plane, clickPoint)) {
      // Transform click point to local space
      clickPoint.sub(new ThreeVector3(...platform.position))
      
      // Check if click is within platform bounds
      const { bounds } = geometry
      if (
        clickPoint.x >= bounds.min[0] && clickPoint.x <= bounds.max[0] &&
        clickPoint.z >= bounds.min[2] && clickPoint.z <= bounds.max[2]
      ) {
        let closestPoint = geometry.points[0]
        let minDistance = Infinity

        geometry.points.forEach(point => {
          const distance = new ThreeVector3(
            point[0], point[1], point[2]
          ).distanceTo(clickPoint)

          if (distance < minDistance) {
            minDistance = distance
            closestPoint = point
          }
        })

        if (minDistance < 0.5) { // Threshold for snapping
          // Transform point back to world space
          const worldPoint: Vector3 = [
            closestPoint[0] + platform.position[0],
            closestPoint[1] + platform.position[1],
            closestPoint[2] + platform.position[2]
          ]
          
          addSelectionPoint({
            position: worldPoint,
            platformId: platform.id,
            selected: true
          })
        }
      }
    }
  }, [geometry, platform.id, platform.position, platformSettings, addSelectionPoint, raycaster])

  if (!selectionCage.visible || !platformSettings?.show) return null

  return (
    <group>
      {/* Grid Lines */}
      {geometry.lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#ffffff"
          lineWidth={1}
          opacity={selectionCage.opacity}
          transparent
        />
      ))}

      {/* Selection Points */}
      {selectionCage.points
        .filter(point => point.platformId === platform.id)
        .map(point => {
          // Transform point to local space for rendering
          const localPoint: Vector3 = [
            point.position[0] - platform.position[0],
            point.position[1] - platform.position[1],
            point.position[2] - platform.position[2]
          ]
          return (
            <Html key={point.id} position={localPoint}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </Html>
          )
        })}
    </group>
  )
} 