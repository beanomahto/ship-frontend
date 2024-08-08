import React, { useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import './layout.css'
import { Outlet } from 'react-router-dom'
import {Helmet} from 'react-helmet'

const Layout = () => {
  const [darktheme, setDarktheme] = useState(false);
  const toggleTheme = () => {
    setDarktheme(!darktheme)
}
const title = 'Shiphere';
const keywords = ""
  return (
    <div className='layout'>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='keywords' content={keywords} />
        <title>{title}</title>
      </Helmet>
      <Header  darktheme={darktheme} />
      <Sidebar darktheme={darktheme} toggleTheme={toggleTheme} />
      <main className='main'>
      <Outlet />
      </main>
    </div>
  )
}

export default Layout
