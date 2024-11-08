export interface PlatformDimensions {
  width: number
  depth: number
  height: number
}

export interface PlatformPositioning {
  horizontal: number
  vertical: number
  responsive: boolean
}

export interface ColorSettings {
  useSameColor: boolean
  platform1Color: string
  platform2Color: string
  platform3Color: string
}

export interface PipeSettings {
  pipeWidth: number
  pipeColor: string
  pipeHeight: number
}

export interface DebugSettings {
  showEdges: boolean
  showPoints: boolean
  showDebug: boolean
  showControls: boolean
  showMesh: boolean
}

export interface LevaControlProps {
  dimensions: PlatformDimensions
  positioning: PlatformPositioning
  colors: ColorSettings
  pipe: PipeSettings
  debug: DebugSettings
} 