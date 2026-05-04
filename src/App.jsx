import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import AddItem from './pages/AddItem'
import Cart from './pages/Cart'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/items" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/items" element={<PrivateRoute><Items /></PrivateRoute>} />
          <Route path="/items/:id" element={<PrivateRoute><ItemDetail /></PrivateRoute>} />
          <Route path="/add-item" element={<PrivateRoute><AddItem /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/items" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
