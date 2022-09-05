import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Main } from './pages';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';

function App() {

  return (
    <BrowserRouter>
      <div className =  "px-5 lg:px-20 py-5 bg-sky-900">
        <Navbar/>
        <Routes>
          <Route path="/" element={ <Main /> } />
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App
