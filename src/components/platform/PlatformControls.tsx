import { useEffect } from 'react'
import { useControls, folder, button, LevaPanel } from 'leva'
import { useStore } from '../../lib/store/editorStore'

export const PlatformControls = () => {
  const updatePlatforms = useStore(state => state.updatePlatforms)
  const updateSelectionCage = useStore(state => state.updateSelectionCage)
  const clearAllPoints = useStore(state => state.clearAllPoints)
  const platforms = useStore(state => state.platforms)

  const dimensions = useControls('dimensions', {
    width: { value: 3.0, min: 1, max: 5, step: 0.1 },
    depth: { value: 2.0, min: 1, max: 5, step: 0.1 },
    height: { value: 0.2, min: 0.1, max: 1, step: 0.1 }
  })

  const positioning = useControls('positioning', {
    horizontal: { value: 2.5, min: 0, max: 5, step: 0.1 },
    vertical: { value: 0.75, min: 0, max: 2, step: 0.05 },
    responsive: false
  })

  const colors = useControls('colors', {
    useSameColor: false,
    platform1Color: { value: '#a8d5ff' },
    platform2Color: { value: '#98ffb3' },
    platform3Color: { value: '#ffb3b3' }
  })

  const pipe = useControls('pipe', {
    pipeWidth: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 },
    pipeColor: { value: '#ff6b00' },
    pipeHeight: { value: 0.1, min: 0.05, max: 0.5, step: 0.01 }
  })

  const debug = useControls('debug', {
    showEdges: true,
    showPoints: false,
    showDebug: true,
    showControls: true,
    showMesh: true
  })

  // Selection Tools - Separate controls for better type safety
  const selectionToolsControls = useControls('Selection Tools', {
    'Show All': true,
    'Platform 1': folder(
      {
        show: { value: true },
        'X Subdivisions': { value: 10, min: 4, max: 20, step: 1 },
        'Y Subdivisions': { value: 10, min: 4, max: 20, step: 1 },
        'Grid Offset': { value: 0.5, min: 0.1, max: 1, step: 0.1 }
      },
      { collapsed: false }
    ),
    'Platform 2': folder(
      {
        show: { value: true },
        'X Subdivisions': { value: 10, min: 4, max: 20, step: 1 },
        'Y Subdivisions': { value: 10, min: 4, max: 20, step: 1 },
        'Grid Offset': { value: 0.5, min: 0.1, max: 1, step: 0.1 }
      },
      { collapsed: false }
    ),
    'Platform 3': folder(
      {
        show: { value: true },
        'X Subdivisions': { value: 10, min: 4, max: 20, step: 1 },
        'Y Subdivisions': { value: 10, min: 4, max: 20, step: 1 },
        'Grid Offset': { value: 0.5, min: 0.1, max: 1, step: 0.1 }
      },
      { collapsed: false }
    ),
    'Clear All Points': button(() => clearAllPoints())
  })

  // Update selection cage settings when controls change
  useEffect(() => {
    if (!selectionToolsControls) return // Guard against undefined controls

    const platformSettings = platforms.reduce((acc, platform) => {
      const platformNumber = parseInt(platform.id)
      const folderName = `Platform ${platformNumber}`
      const folderControls = selectionToolsControls[folderName]

      if (folderControls) {
        acc[platform.id] = {
          show: folderControls.show,
          xSubdivisions: folderControls['X Subdivisions'],
          ySubdivisions: folderControls['Y Subdivisions'],
          gridOffset: folderControls['Grid Offset']
        }
      }
      return acc
    }, {} as Record<string, any>)

    updateSelectionCage({
      platformSettings,
      visible: selectionToolsControls['Show All']
    })
  }, [selectionToolsControls, platforms, updateSelectionCage])

  useEffect(() => {
    updatePlatforms({
      dimensions,
      positioning,
      colors: {
        useSameColor: colors.useSameColor,
        platform1Color: colors.platform1Color,
        platform2Color: colors.platform2Color,
        platform3Color: colors.platform3Color
      },
      pipe: {
        pipeWidth: pipe.pipeWidth,
        pipeColor: pipe.pipeColor,
        pipeHeight: pipe.pipeHeight
      },
      debug: {
        showEdges: debug.showEdges,
        showPoints: debug.showPoints,
        showDebug: debug.showDebug,
        showControls: debug.showControls,
        showMesh: debug.showMesh
      }
    })
  }, [dimensions, positioning, colors, pipe, debug, updatePlatforms])

  return (
    <div className="fixed top-4 right-4 z-50 max-h-[calc(100vh-8rem)] overflow-auto">
      <LevaPanel 
        fill 
        titleBar={false}
        theme={{
          colors: {
            elevation1: '#1a1a1a',
            elevation2: '#2a2a2a',
            elevation3: '#3a3a3a',
          }
        }}
      />
    </div>
  )
} 