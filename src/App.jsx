import { Route, Routes } from 'react-router-dom'
import './App.css'
import Error from './pages/Error/Error'
import LogIn from './pages/logIn/LogIn'
import Home from './pages/home/Home'
import Ragistration from './pages/registration/Ragistration'
import Chat from './pages/Chat'



function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={ <LogIn></LogIn> } />
        <Route path='/ragistration' element={ <Ragistration></Ragistration> } />
        <Route path='/home' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='*' element={ <Error></Error> } />
      </Routes>

    </>
  )
}

export default App
