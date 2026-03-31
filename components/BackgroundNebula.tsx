import React from 'react'

function BackgroundNebula() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 nebula-glow-purple"></div>
        <div className="absolute inset-0 nebula-glow-teal"></div>
      </div>
    </>
  )
}

export default BackgroundNebula