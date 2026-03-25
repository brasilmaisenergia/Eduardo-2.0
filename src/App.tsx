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
                                  <h1>Eduardo 2.0</h1>h1>
                                  <ul>
                                              <li><a href="/chat">Chat</a>a></li>li>
                                              <li><a href="/noticias-analise">Notícias Analisadas</a>a></li>li>
                                              <li><a href="/noticias">Notícias</a>a></li>li>
                                              <li><a href="/inteligencia">Inteligência</a>a></li>li>
                                  </ul>ul>
                        </nav>nav>
                        <main>
                                  <Routes>
                                              <Route path="/chat" element={<ChatPage />} />
                                              <Route path="/noticias-analise" element={<NoticiasAnalise />} />
                                              <Route path="/noticias" element={<Noticias />} />
                                              <Route path="/inteligencia" element={<InteligenciaDashboard />} />
                                              <Route path="/" element={<Navigate to="/chat" replace />} />
                                  </Routes>Routes>
                        </main>main>
                </div>div>
          </Router>Router>
        )
}

export default App</Router>
