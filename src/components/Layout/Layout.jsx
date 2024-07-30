import React, { useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import './layout.css'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const [darktheme, setDarktheme] = useState(false);
  const toggleTheme = () => {
    setDarktheme(!darktheme)
}
  return (
    <div className='layout'>
      <Header  darktheme={darktheme} />
      <Sidebar darktheme={darktheme} toggleTheme={toggleTheme} />
      <main className='main'>
      <Outlet />
      </main>
    </div>
  )
}

export default Layout
