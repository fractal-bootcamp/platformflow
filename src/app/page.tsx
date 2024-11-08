'use client'

import { useState, useCallback } from 'react'
import { Scene } from '@/components/scene/Scene'
import { ResizeHandle } from '@/components/ui/ResizeHandle'

export default function Home() {
  const [frameHeight, setFrameHeight] = useState(window.innerHeight - 40) // Initial height minus footer

  const handleResize = useCallback((height: number) => {
    setFrameHeight(height)
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="absolute top-4 left-8 z-10">
        <h1 className="text-3xl font-bold text-white/90">Platform Flow</h1>
        <p className="text-base font-mono text-white/70">
          Interactive 3D visualization of connected platform processes
        </p>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {/* Resizable Visualization Container */}
        <div 
          className="relative w-full transition-all duration-75 ease-out"
          style={{ height: 100 }}
        >
          <div className="w-full h-full border border-blue-400/20">
            <Scene />
        
          </div>
          
          {/* Resize Handle */}
          <ResizeHandle onResize={handleResize} />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 h-12 bg-gray-900/50 backdrop-blur-sm border-t border-blue-400/20">
        <div className="w-full h-full max-w-[95%] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-xs font-mono text-white/50 whitespace-nowrap">
              Platform Flow v1.0.0
            </span>
            <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
            <span className="hidden sm:block text-xs font-mono text-white/50 whitespace-nowrap">
              Interactive Mode
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-xs font-mono text-white/70 hover:text-white/90 transition-colors whitespace-nowrap">
              Reset View
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <button className="px-3 py-1 text-xs font-mono text-white/70 hover:text-white/90 transition-colors whitespace-nowrap">
              Clear Selection
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
