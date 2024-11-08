import { useState, useCallback } from 'react'

interface ResizeHandleProps {
  onResize: (height: number) => void
  minHeight?: number
  maxHeight?: number
}

export const ResizeHandle = ({ 
  onResize, 
  minHeight = 400, 
  maxHeight = window.innerHeight - 100 
}: ResizeHandleProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const newHeight = window.innerHeight - e.clientY
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      onResize(newHeight)
    }
  }, [isDragging, minHeight, maxHeight, onResize])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add and remove event listeners
  useState(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div 
      className={`
        absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize 
        bg-gradient-to-t from-blue-400/20 to-transparent
        hover:from-blue-400/30 transition-colors
        ${isDragging ? 'from-blue-400/40' : ''}
      `}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute left-1/2 bottom-1 -translate-x-1/2 w-16 h-1 bg-blue-400/20 rounded-full" />
    </div>
  )
} 