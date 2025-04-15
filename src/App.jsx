import { useState } from 'react'
import Navbar from './Navbar'
import Patient from './Patient'
import Admin from './Admin'
import Home from './Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
     <Navbar/>
     <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/patients" element={<Patient />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
