// Noticias_refatorado.tsx - Página de Notícias Eduardo 2.0
// Path: src/pages/Noticias.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw, Filter, X, ChevronDown, AlertCircle } from 'lucide-react'
import newsApiClient, { type NoticiaAPI, type FiltrosNoticias } from '../services/newsApiClient'

interface UIState {
  carregando: boolean
  atualizando: boolean
  erro: string | null
  sucessoMensagem: string | null
}

const Noticias: React.FC = () => {
  const [noticias, setNoticias] = useState<NoticiaAPI[]>([])
  const [noticiasFiltradas, setNoticiasFiltradas] = useState<NoticiaAPI[]>([])
  const [ui, setUI] = useState<UIState>({
    carregando: true,
    atualizando: false,
    erro: null,
    sucessoMensagem: null,
  })

  // Filtros
  const [filtros, setFiltros] = useState<FiltrosNoticias>({
    busca: '',
    fonte: '',
    tamanho: 20,
    dias: 7,
  })

  const [fontes, setFontes] = useState<string[]>([
    'CCEE',
    'ONS',
    'ANEEL',
    'EPE',
    'MME',
    'ABSolar',
    'ABRAGET',
    'Canal Energia',
    'Megawatt',
  ])

  const [paginaAtual, setPaginaAtual] = useState(1)

  // Carregar notícias ao iniciar ou ao mudar filtros
  const carregarNoticias = useCallback(async () => {
    setUI((prev) => ({ ...prev, carregando: true, erro: null }))

    try {
      const dados = await newsApiClient.listarNoticias(filtros)
      setNoticias(dados)
      aplicarFiltros(dados)
    } catch (erro) {
      setUI((prev) => ({
        ...prev,
        erro: `Erro ao carregar notícias: ${erro instanceof Error ? erro.message : 'erro desconhecido'}`,
      }))
    } finally {
      setUI((prev) => ({ ...prev, carregando: false }))
    }
  }, [filtros])

  // Aplicar filtros localmente (busca + fonte)
  const aplicarFiltros = (dados: NoticiaAPI[]) => {
    let resultado = dados

    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase()
      resultado = resultado.filter(
        (n) =>
          n.titulo?.toLowerCase().includes(termoBusca) ||
          n.conteudo?.toLowerCase().includes(termoBusca) ||
          n.fonte?.toLowerCase().includes(termoBusca)
      )
    }

    if (filtros.fonte) {
      resultado = resultado.filter((n) => n.fonte === filtros.fonte)
    }

    setNoticiasFiltradas(resultado)
    setPaginaAtual(1) // Reset para primeira página
  }

  // Atualizar quando filtros mudam
  useEffect(() => {
    aplicarFiltros(noticias)
  }, [filtros.busca, filtros.fonte, noticias])

  // Carregar notícias ao montar componente
  useEffect(() => {
    carregarNoticias()
  }, [carregarNoticias])

  // Atualizar notícias via API
  const handleAtualizar = async () => {
    setUI((prev) => ({ ...prev, atualizando: true, erro: null, sucessoMensagem: null }))

    try {
      const resultado = await newsApiClient.atualizar(filtros.fonte)

      if (resultado.success) {
        setUI((prev) => ({
          ...prev,
          sucessoMensagem: `✅ ${resultado.mensagem} (${resultado.total || 0} notícias)`,
        }))

        // Recarregar notícias
        setTimeout(() => {
          carregarNoticias()
        }, 1000)
      } else {
        setUI((prev) => ({
          ...prev,
          erro: resultado.mensagem,
        }))
      }
    } catch (erro) {
      setUI((prev) => ({
        ...prev,
        erro: `Erro ao atualizar: ${erro instanceof Error ? erro.message : 'erro desconhecido'}`,
      }))
    } finally {
      setUI((prev) => ({ ...prev, atualizando: false }))

      // Limpar mensagens após 5 segundos
      setTimeout(() => {
        setUI((prev) => ({
          ...prev,
          sucessoMensagem: null,
          erro: null,
        }))
      }, 5000)
    }
  }

  // Resetar filtros
  const handleLimparFiltros = () => {
    setFiltros({
      busca: '',
      fonte: '',
      tamanho: 20,
      dias: 7,
    })
    setPaginaAtual(1)
  }

  // Paginação
  const itensPorPagina = 10
  const totalPaginas = Math.ceil(noticiasFiltradas.length / itensPorPagina)
  const indiceInicio = (paginaAtual - 1) * itensPorPagina
  const noticiasPaginadas = noticiasFiltradas.slice(indiceInicio, indiceInicio + itensPorPagina)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">🔋 Eduardo - Notícias de Energia</h1>
            <button
              onClick={handleAtualizar}
              disabled={ui.atualizando}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <RefreshCw size={18} className={ui.atualizando ? 'animate-spin' : ''} />
              {ui.atualizando ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Notificações */}
      {ui.erro && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle size={20} />
            {ui.erro}
          </div>
        </div>
      )}

      {ui.sucessoMensagem && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {ui.sucessoMensagem}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={filtros.busca}
                onChange={(e) => setFiltros((prev) => ({ ...prev, busca: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Fonte */}
            <div>
              <select
                value={filtros.fonte}
                onChange={(e) => setFiltros((prev) => ({ ...prev, fonte: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value="">Todas as fontes</option>
                {fontes.map((fonte) => (
                  <option key={fonte} value={fonte}>
                    {fonte}
                  </option>
                ))}
              </select>
            </div>

            {/* Dias */}
            <div>
              <select
                value={filtros.dias}
                onChange={(e) => setFiltros((prev) => ({ ...prev, dias: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value={7}>Últimos 7 dias</option>
                <option value={14}>Últimos 14 dias</option>
                <option value={30}>Últimos 30 dias</option>
                <option value={90}>Últimos 90 dias</option>
              </select>
            </div>

            {/* Limpar */}
            <button
              onClick={handleLimparFiltros}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              <X size={18} />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Contagem */}
        <div className="mb-4 text-slate-600">
          <p className="text-sm font-medium">
            Mostrando <span className="font-bold text-slate-900">{noticiasPaginadas.length}</span> de{' '}
            <span className="font-bold text-slate-900">{noticiasFiltradas.length}</span> notícias
          </p>
        </div>

        {/* Carregando */}
        {ui.carregando ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : noticiasPaginadas.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-slate-600 text-lg">Nenhuma notícia encontrada com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {noticiasPaginadas.map((noticia) => (
              <div
                key={noticia.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a
                      href={noticia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-blue-600 hover:text-blue-800 transition line-clamp-2"
                    >
                      {noticia.titulo}
                    </a>

                    <p className="text-slate-600 text-sm mt-2 line-clamp-3">{noticia.conteudo}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
                      <span className="bg-slate-100 px-3 py-1 rounded-full font-semibold text-slate-700">
                        {noticia.fonte}
                      </span>
                      <span>
                        📅 {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}
                      </span>
                      {noticia.relevancia && (
                        <span>⭐ Relevância: {(noticia.relevancia * 100).toFixed(0)}%</span>
                      )}
                    </div>

                    {/* Perspectivas */}
                    {(noticia.perspectiva_tecnica ||
                      noticia.perspectiva_politica ||
                      noticia.perspectiva_ambiental ||
                      noticia.perspectiva_economica ||
                      noticia.perspectiva_social) && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-2">Perspectivas:</p>
                        <div className="flex flex-wrap gap-2">
                          {noticia.perspectiva_tecnica && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              🔧 Técnica: {noticia.perspectiva_tecnica.substring(0, 30)}...
                            </span>
                          )}
                          {noticia.perspectiva_politica && (
                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                              🏛️ Política: {noticia.perspectiva_politica.substring(0, 30)}...
                            </span>
                          )}
                          {noticia.perspectiva_ambiental && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                              🌱 Ambiental: {noticia.perspectiva_ambiental.substring(0, 30)}...
                            </span>
                          )}
                          {noticia.perspectiva_economica && (
                            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                              💰 Econômica: {noticia.perspectiva_economica.substring(0, 30)}...
                            </span>
                          )}
                          {noticia.perspectiva_social && (
                            <span className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded">
                              👥 Social: {noticia.perspectiva_social.substring(0, 30)}...
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(1, prev - 1))}
              disabled={paginaAtual === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPaginaAtual(i + 1)}
                className={`px-3 py-2 rounded-lg transition ${
                  paginaAtual === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))}
              disabled={paginaAtual === totalPaginas}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Próxima
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 py-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-600">
          <p>Eduardo 2.0 - Sistema de Análise de Notícias de Energia com Inteligência Rastreável</p>
          <p className="mt-1">Fontes: CCEE, ONS, ANEEL, EPE, MME, ABSolar, ABRAGET, Canal Energia, Megawatt</p>
        </div>
      </div>
    </div>
  )
}

export default Noticias
