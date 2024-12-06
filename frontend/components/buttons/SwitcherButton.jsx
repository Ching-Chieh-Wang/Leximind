'use client'
import  { useState } from 'react'

const SwitcherButton = ({onBody, offBody,status, onOn=()=>{}, onOff=()=>{}}) => {
  const [isChecked, setIsChecked] = useState(status)


  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
    if(isChecked)onOn();
    else onOff();
  }

  return (
    <div data-keep-open="true" onClick={(e) => e.stopPropagation()} >
      <label className=' shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md h-10 p-1  border-4 border-orange-200 '>
        <input
          type='checkbox'
          className='sr-only'
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`flex items-center space-x-3 rounded py-1 px-4 text-sm font-medium ${
            !isChecked ? 'text-white bg-orange-800' : 'text-gray-600'
          }`}
        >
          {offBody}
        </span>
        <span
          className={`flex items-center space-x-3 rounded py-1 px-4 text-sm font-medium ${
            isChecked ? 'text-white bg-orange-400 '  : 'text-gray-600'
          }`}
        >
          {onBody}
        </span>
      </label>
    </div>
  )
}

export default SwitcherButton
