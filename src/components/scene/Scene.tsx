import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Center, Grid } from '@react-three/drei'
import { Platform } from '../platform/Platform'
import { PlatformControls } from '../platform/PlatformControls'
import { useStore } from '../../lib/store/editorStore'
import { LevaStoreProvider } from 'leva'

export const Scene = () => {
  const platforms = useStore(state => state.platforms)
  const positioning = useStore(state => state.positioning)
  const debug = useStore(state => state.debug)

  const platform2Position = [
    positioning.horizontal,
    -positioning.vertical,
    positioning.horizontal
  ] as const

  return (
    <LevaStoreProvider>
      <Canvas 
        shadows 
        camera={{ 
          position: [10, 10, 10],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
      >
        <PerspectiveCamera 
          makeDefault 
          position={[8, 8, 8]}
        />
        
        {/* Debug Controls */}
        {debug.showControls && (
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={5}
            maxDistance={20}
            target={platform2Position}
          />
        )}
        
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[-5, 8, -5]}
          intensity={0.6}
          castShadow={debug.showDebug}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Debug Grid */}
        {debug.showDebug && (
          <Grid
            position={[0, -2.5, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={1}
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1.5}
            sectionColor="#9f9f9f"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
          />
        )}
        
        <Center scale={1.1}>
          <group position={[-positioning.horizontal, positioning.vertical, -positioning.horizontal]}>
            {platforms.map((platform, index) => (
              <Platform key={platform.id} {...platform} index={index} />
            ))}
          </group>
        </Center>

        <fog attach="fog" args={['#1a1a1a', 20, 30]} />
      </Canvas>
      <PlatformControls />
    </LevaStoreProvider>
  )
} 