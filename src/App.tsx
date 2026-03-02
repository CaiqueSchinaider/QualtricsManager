
import { Toaster } from 'react-hot-toast'
import './App.css'
import AppRouter from './Router/router'
import './styles/hideScrollbar.css';


function App() {


  return (
    <>
    <AppRouter/>
    <Toaster />
    </>
  )
}

export default App
