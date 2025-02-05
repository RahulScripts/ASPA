import React from 'react'
import { Route, Routes } from 'react-router-dom' // Import Routes and Route
import './styles/fonts.css'

import Dashbord from './components/Dashbord'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

const App: React.FC = () => {
  return (
    <div>
      {/* Your routing logic */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashbord" element={<Dashbord />} />
      </Routes>
    </div>
  )
}

export default App
