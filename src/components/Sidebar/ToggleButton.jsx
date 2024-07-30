import React from 'react'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import { Button } from 'antd'

const ToggleButton = ({darktheme, toggleTheme}) => {
  return (
    <div className="toggle-theme-btn">
        <Button onClick={toggleTheme}>{darktheme ? <HiOutlineSun /> : <HiOutlineMoon />}</Button>
    </div>
  )
}

export default ToggleButton
