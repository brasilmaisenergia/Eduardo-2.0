import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Noticias from './pages/Noticias'
import InteligenciaDashboard from './pages/InteligenciaDashboard'

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1>Eduardo 2.0</h1>
          <ul>
            <li><a href="/noticias">Notícias</a></li>
            <li><a href="/inteligencia">Inteligência</a></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/inteligencia" element={<InteligenciaDashboard />} />
            <Route path="/" element={<Navigate to="/noticias" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
