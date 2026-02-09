import React from 'react'

const BlurBg = ({top = "auto" , bottom = "auto" , left = "auto" , right = "auto"}) => {
  return (
    <div style={{top:top,left:left,right:right,bottom:bottom}} 
    className="absolute -z-50 rounded-full pointer-events-none bg-primary/30 blur-3xl aspect-square h-58  w-58 ">
      
    </div>
  )
}

export default BlurBg
