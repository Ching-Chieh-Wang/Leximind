import React from 'react'

const ListIcon = ({ size = 16 }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            width={size} 
            height={size} 
        >
    <path d="M8 5L20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 5H4.00898" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 12H4.00898" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 19H4.00898" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 19L20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>
  )
}

export default ListIcon