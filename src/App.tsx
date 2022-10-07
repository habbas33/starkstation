import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Test, Main } from './pages';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { PriceContextProvider } from './context/PriceContext';

function App() {

  return (
    <BrowserRouter>
      <div className =  "min-h-[100vh] px-5 sm:px-10 md:px-15 lg:px-20 xl:px-40 2xl:px-60 py-8 bg-main caret-transparent">
        <PriceContextProvider>
          <Navbar/>
          <Routes>
            <Route path="/test" element={ <Test /> } />
          </Routes>
          
          <Routes>
            <Route path="/" element={ <Main /> } />
          </Routes>
          <Footer/>
        </PriceContextProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
