/**
 * Notícias Analisadas por Stakeholders
 * Exibe notícias do setor energético agrupadas por stakeholders
 */

import { useState, useEffect } from 'react'

interface Noticia {
  id: string
  titulo: string
  resumo_cognitivo: string
  analise_completa: string
  fonte: string
  url_original: string
  data_publicacao: string
  stakeholders: string[]
  relevancia: 'alta' | 'media' | 'baixa'
  relevancia_score: number
  tags: string[]
  status: string
}

const STAKEHOLDERS = [
  'ONS',
  'CCEE',
  'ANEEL',
  'EPE',
  'Consumidores',
  'Geradores',
  'Transmissoras',
  'Distribuidoras',
  'Governo',
]

const RELEVANCIA_CORES = {
  alta: 'bg-red-100 border-red-300 text-red-900',
  media: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  baixa: 'bg-green-100 border-green-300 text-green-900',
}

export function NoticiasAnalise() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(
    null
  )
  const [expandedNews, setExpandedNews] = useState<string | null>(null)

  useEffect(() => {
    carregarNoticias()
  }, [])

  const carregarNoticias = async () => {
    try {
      setLoading(true)
      // Fetch from Supabase via REST API
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(
        `${supabaseUrl}/rest/v1/noticias?status=eq.publicada&order=data_publicacao.desc`,
        {
          headers: {
            apikey: supabaseKey || '',
            Accept: 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setNoticias(data)
      }
    } catch (erro) {
      console.error('Erro ao carregar notícias:', erro)
    } finally {
      setLoading(false)
    }
  }

  const noticiasFiltradasPorStakeholder = selectedStakeholder
    ? noticias.filter((n) =>
        n.stakeholders?.includes(selectedStakeholder)
      )
    : noticias

  const noticiasOrdenadasPorRelevancia = [...noticiasFiltradasPorStakeholder].sort(
    (a, b) => (b.relevancia_score || 0) - (a.relevancia_score || 0)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notícias Analisadas</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe as notícias do setor energético com análises automáticas por stakeholder
          </p>
        </div>

        {/* Stakeholder Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filtrar por Stakeholder
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStakeholder(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedStakeholder === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {STAKEHOLDERS.map((stakeholder) => (
              <button
                key={stakeholder}
                onClick={() => setSelectedStakeholder(stakeholder)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedStakeholder === stakeholder
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {stakeholder}
              </button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {noticiasOrdenadasPorRelevancia.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">Nenhuma notícia encontrada</p>
            </div>
          ) : (
            noticiasOrdenadasPorRelevancia.map((noticia) => (
              <div
                key={noticia.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border-l-4 ${
                  RELEVANCIA_CORES[noticia.relevancia || 'media']
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {noticia.titulo}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold">{noticia.fonte}</span>
                        <span>
                          {new Date(noticia.data_publicacao || '').toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          RELEVANCIA_CORES[noticia.relevancia || 'media']
                        }`}>
                          Relevância: {noticia.relevancia_score || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {noticia.resumo_cognitivo || 'Sem resumo disponível'}
                  </p>

                  {/* Stakeholders */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                      Afeta:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {noticia.stakeholders?.map((stakeholder) => (
                        <span
                          key={stakeholder}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {stakeholder}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {noticia.tags && noticia.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {noticia.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expandable Analysis */}
                  <button
                    onClick={() =>
                      setExpandedNews(
                        expandedNews === noticia.id ? null : noticia.id
                      )
                    }
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm mb-4"
                  >
                    {expandedNews === noticia.id
                      ? '▼ Fechar análise'
                      : '▶ Ver análise completa'}
                  </button>

                  {expandedNews === noticia.id && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Análise Eduardo:
                      </h4>
                      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {noticia.analise_completa || 'Análise não disponível'}
                      </p>
                    </div>
                  )}

                  {/* Link to original */}
                  <a
                    href={noticia.url_original}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                  >
                    Ler notícia original →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {noticias.length}
              </p>
              <p className="text-gray-600">Notícias Publicadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {noticias.filter((n) => n.relevancia === 'alta').length}
              </p>
              <p className="text-gray-600">Alta Relevância</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-600">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
              <p className="text-gray-600">Atualizado em</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoticiasAnalise
