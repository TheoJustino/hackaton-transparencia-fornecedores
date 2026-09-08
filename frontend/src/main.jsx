import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NovoFornecedor from './pages/NovoFornecedor'
import './index.css'

console.log('Aplicação iniciada!')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}  /> {/* Login */}
        <Route path="/register" element={<Register />} /> {/* Cadastro */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter> 
  </StrictMode>,
)

