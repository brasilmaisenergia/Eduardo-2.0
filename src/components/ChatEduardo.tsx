/**
 * Chat Eduardo Component
 * Interface para comunicação com Eduardo (assistente de IA)
 */

import { useState, useRef, useEffect } from 'react'
import { eduardoService } from '../services/eduardoService'

interface Message {
  id: string
  tipo: 'usuario' | 'eduardo'
  conteudo: string
  timestamp: string
  carregando?: boolean
}

export function ChatEduardo() {
  const [mensagens, setMensagens] = useState<Message[]>([
    {
      id: '1',
      tipo: 'eduardo',
      conteudo: 'Olá! Sou Eduardo, seu assistente de IA especializado em análise de notícias e indicadores sobre Brasil Mais Energia. Como posso ajudá-lo?',
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [carregando, setCarregando] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) {
      return
    }

    const userMessage: Message = {
      id: String(Date.now()),
      tipo: 'usuario',
      conteudo: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMensagens((prev) => [...prev, userMessage])
    setInputValue('')
    setCarregando(true)

    try {
      const resposta = await eduardoService.askEduardo(inputValue)

      if (resposta.success) {
        const eduardoMessage: Message = {
          id: String(Date.now() + 1),
          tipo: 'eduardo',
          conteudo: resposta.response,
          timestamp: resposta.timestamp,
        }
        setMensagens((prev) => [...prev, eduardoMessage])
      } else {
        const errorMessage: Message = {
          id: String(Date.now() + 1),
          tipo: 'eduardo',
          conteudo: resposta.error || 'Desculpe, ocorreu um erro ao processar sua pergunta.',
          timestamp: new Date().toISOString(),
        }
        setMensagens((prev) => [...prev, errorMessage])
      }
    } catch (erro) {
      const errorMessage: Message = {
        id: String(Date.now() + 1),
        tipo: 'eduardo',
        conteudo: 'Desculpe, ocorreu um erro ao comunicar com o servidor.',
        timestamp: new Date().toISOString(),
      }
      setMensagens((prev) => [...prev, errorMessage])
      console.error('Erro ao enviar mensagem:', erro)
    } finally {
      setCarregando(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Eduardo - Assistente de IA</h1>
        <p className="text-sm text-gray-600 mt-1">Análise de notícias e indicadores sobre Brasil Mais Energia</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.tipo === 'usuario'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {msg.conteudo}
              </p>
              <p
                className={`text-xs mt-2 ${
                  msg.tipo === 'usuario' ? 'text-blue-100' : 'text-gray-600'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
        <form onSubmit={enviarMensagem} className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Faça uma pergunta para Eduardo..."
            disabled={carregando}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={carregando || !inputValue.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {carregando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}
