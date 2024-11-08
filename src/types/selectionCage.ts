import { Vector3 } from './editor'

export interface GridPoint {
  id: string
  position: Vector3
  platformId: string
  selected: boolean
}

export interface GridLine {
  start: Vector3
  end: Vector3
  orientation: 'horizontal' | 'vertical'
}

export interface PlatformGridSettings {
  show: boolean
  xSubdivisions: number
  ySubdivisions: number
  gridOffset: number
}

export interface SelectionCageState {
  points: GridPoint[]
  selectedPoints: string[]
  platformSettings: {
    [key: string]: PlatformGridSettings
  }
  visible: boolean
  opacity: number
}

export interface SelectionCageGeometry {
  points: Vector3[]
  lines: GridLine[]
  bounds: {
    min: Vector3
    max: Vector3
  }
} 