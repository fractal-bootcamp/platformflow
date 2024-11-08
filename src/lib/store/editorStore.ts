import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { 
  EditorState, 
  Platform, 
  Vector3, 
  EditorSettings, 
  SelectionCageState, 
  SelectionCageSettings, 
  GridPoint 
} from '../../types/editor'

const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: '1',
    position: [0, 0, 0],
    title: 'Create a Project Charter',
    size: [4, 0.25, 3],
  },
  {
    id: '2',
    position: [2, -1, 2],
    title: 'Make a Hypothetical Retrospective Success Story',
    size: [4, 0.25, 3],
  },
  {
    id: '3',
    position: [4, -2, 4],
    title: 'Achieve High-Resolution Technical and Financial Insight',
    size: [4, 0.25, 3],
  },
]

export const useStore = create<EditorState>()((set) => ({
  platforms: DEFAULT_PLATFORMS,
  selectedPlatform: null,
  dimensions: {
    width: 3.0,
    depth: 2.0,
    height: 0.2
  },
  positioning: {
    horizontal: 2.5,
    vertical: 0.75,
    responsive: false
  },
  colors: {
    useSameColor: false,
    platform1Color: '#a8d5ff',
    platform2Color: '#98ffb3',
    platform3Color: '#ffb3b3'
  },
  pipe: {
    pipeWidth: 0.05,
    pipeColor: '#ff6b00',
    pipeHeight: 0.1
  },
  debug: {
    showEdges: true,
    showPoints: false,
    showDebug: true,
    showControls: true,
    showMesh: true
  },
  selectionCage: {
    points: [],
    selectedPoints: [],
    subdivisions: {
      x: 8,
      y: 6
    },
    heightOffset: 0.1,
    visible: true,
    opacity: 0.5
  },
  updateSelectionCage: (settings: SelectionCageSettings) => 
    set(state => ({
      selectionCage: {
        ...state.selectionCage,
        ...settings
      }
    })),
  addSelectionPoint: (point: Omit<GridPoint, 'id'>) =>
    set(state => ({
      selectionCage: {
        ...state.selectionCage,
        points: [
          ...state.selectionCage.points,
          { ...point, id: nanoid() }
        ]
      }
    })),
  removeSelectionPoint: (id: string) =>
    set(state => ({
      selectionCage: {
        ...state.selectionCage,
        points: state.selectionCage.points.filter(p => p.id !== id)
      }
    })),
  clearSelectionPoints: () =>
    set(state => ({
      selectionCage: {
        ...state.selectionCage,
        points: []
      }
    })),
  setSelectedPlatform: (id: string | null) => set({ selectedPlatform: id }),
  updatePlatformPosition: (id: string, position: Vector3) =>
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.id === id ? { ...p, position } : p
      ),
    })),
  updatePlatforms: (settings: EditorSettings) => set((state) => {
    const { dimensions, positioning, colors, pipe, debug } = settings
    
    const platforms = state.platforms.map((platform, index) => ({
      ...platform,
      size: [dimensions.width, dimensions.height, dimensions.depth] as Vector3,
      position: [
        index * positioning.horizontal,
        -index * positioning.vertical,
        index * positioning.horizontal
      ] as Vector3
    }))

    return {
      platforms,
      dimensions,
      positioning,
      colors,
      pipe,
      debug
    }
  })
})) 