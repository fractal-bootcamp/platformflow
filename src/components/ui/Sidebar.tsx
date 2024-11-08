import { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
  title?: string
  position?: 'left' | 'right'
}

export const Sidebar = ({ 
  children, 
  title = 'Tools', 
  position = 'left' 
}: SidebarProps) => {
  return (
    <div 
      className={`
        fixed ${position}-0 top-0 bottom-12 w-64 
        bg-gray-900/50 backdrop-blur-sm 
        border-r border-blue-400/20
        flex flex-col
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-blue-400/20">
        <h2 className="text-sm font-mono text-white/70">{title}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
} 