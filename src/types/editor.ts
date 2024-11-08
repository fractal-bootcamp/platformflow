export type Vector3 = [number, number, number]

export interface Platform {
  id: string
  position: Vector3
  size: Vector3
  title: string
}

export interface PlatformProps extends Platform {
  index: number
}

export type PipeSegmentType = 'straight' | 'elbow'

export interface PipeSegment {
  start: Vector3
  end: Vector3
  type: PipeSegmentType
}

export interface EditorState {
  platforms: Platform[]
  selectedPlatform: string | null
  dimensions: PlatformDimensions
  positioning: PlatformPositioning
  colors: ColorSettings
  pipe: PipeSettings
  debug: DebugSettings
  setSelectedPlatform: (id: string | null) => void
  updatePlatformPosition: (id: string, position: Vector3) => void
  updatePlatforms: (settings: EditorSettings) => void
}

export interface EditorSettings {
  dimensions: PlatformDimensions
  positioning: PlatformPositioning
  colors: ColorSettings
  pipe: PipeSettings
  debug: DebugSettings
} 