import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Main, Disclaimer, TermsOfUse } from './pages';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { PriceContextProvider } from './context/PriceContext';
import { AppContextProvider } from './context/AppContext';

function App() {

  return (
    <BrowserRouter>
      <div className="bg-black text-sm text-red-300 text-right w-full py-1 px-5 sm:px-10 md:px-15 lg:px-20 xl:px-[8.5rem] 2xl:px-60">
        StarkStation is Alpha!
      </div>
      <div className =  "min-h-[100vh] px-5 sm:px-10 md:px-15 lg:px-20 xl:px-[8.5rem] 2xl:px-60 py-8 bg-main caret-transparent">
        <PriceContextProvider>
          <AppContextProvider>
            <Navbar/>
            <Routes>
              <Route path="/" element={ <Main /> } />
            </Routes>

            <Routes>
              <Route path="/disclaimer" element={ <Disclaimer /> } />
            </Routes>

            <Routes>
              <Route path="/terms-of-use" element={ <TermsOfUse /> } />
            </Routes>

            <Footer/>
          </AppContextProvider>
        </PriceContextProvider>
      </div>
    </BrowserRouter>
  )
}

export default App
