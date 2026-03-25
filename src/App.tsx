import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Noticias from './pages/Noticias'
import InteligenciaDashboard from './pages/InteligenciaDashboard'
import ChatPage from './pages/ChatPage'
import NoticiasAnalise from './pages/NoticiasAnalise'

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1>Eduardo 2.0</h1>
          <ul>
            <li><a href="/chat">Chat</a></li>
            <li><a href="/noticias-analise">Notícias Analisadas</a></li>
            <li><a href="/noticias">Notícias</a></li>
            <li><a href="/inteligencia">Inteligência</a></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/noticias-analise" element={<NoticiasAnalise />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/inteligencia" element={<InteligenciaDashboard />} />
            <Route path="/" element={<Navigate to="/chat" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
