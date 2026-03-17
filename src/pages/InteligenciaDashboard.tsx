// InteligenciaDashboard.tsx
// Path: src/pages/InteligenciaDashboard.tsx

import React, { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricaInteligencia {
  id?: string
  data: string
  score_geral: number
  score_tecnica: number
  score_politica: number
  score_ambiental: number
  score_economica: number
  score_social: number
  insights_novos: number
  coerencia_narrativa: number
  profundidade_media: number
  tendencia: 'up' | 'down' | 'stable'
}

interface Estatisticas {
  score_medio: number
  score_maximo: number
  score_minimo: number
  total_registros: number
  tendencia_geral: 'up' | 'down' | 'stable'
}

export default function InteligenciaDashboard() {
  const [metricas, setMetricas] = useState<MetricaInteligencia[]>([])
  const [ultimaMetrica, setUltimaMetrica] = useState<MetricaInteligencia | null>(null)
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    buscarDados()
    // Atualizar a cada 5 minutos
    const intervalo = setInterval(buscarDados, 5 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  async function buscarDados() {
    try {
      setErro(null)

      // Buscar tendência
      const resTendencia = await fetch('/api/inteligencia/tendencia?dias=30')
      const dataTendencia = await resTendencia.json()

      if (dataTendencia.status === 'success') {
        setMetricas(dataTendencia.metricas || [])
      } else if (dataTendencia.status === 'vazio') {
        setErro('Sem dados coletados ainda. Aguarde o primeiro ciclo de análise.')
      }

      // Buscar última métrica
      const resUltima = await fetch('/api/inteligencia/ultima')
      const dataUltima = await resUltima.json()

      if (dataUltima.status === 'success') {
        setUltimaMetrica(dataUltima.metrica)
      }

      // Buscar estatísticas
      const resEstat = await fetch('/api/inteligencia/estatisticas')
      const dataEstat = await resEstat.json()

      if (dataEstat.status === 'success') {
        setEstatisticas(dataEstat.estatisticas)
      }
    } catch (err) {
      console.error('Erro ao buscar dados de inteligência:', err)
      setErro('Erro ao carregar dados. Verifique se a API está disponível.')
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Carregando dados de inteligência...</p>
          </div>
        </div>
      </div>
    )
  }

  if (erro && metricas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">🧠 Dashboard de Inteligência do Eduardo</h1>
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6">
            <p className="text-yellow-200">{erro}</p>
            <p className="text-yellow-200 text-sm mt-2">
              O Eduardo coleta dados às 06:00 nos dias de semana. Volte em breve!
            </p>
          </div>
        </div>
      </div>
    )
  }

  const scoreAtual = ultimaMetrica?.score_geral || 0
  const indicadorTendencia =
    ultimaMetrica?.tendencia === 'up' ? '📈' : ultimaMetrica?.tendencia === 'down' ? '📉' : '→'

  // Preparar dados para gráfico
  const dadosGrafico = metricas.map((m) => ({
    data: new Date(m.data).toLocaleDateString('pt-BR'),
    'Score Geral': Number(m.score_geral.toFixed(1)),
    Técnica: Number(m.score_tecnica.toFixed(1)),
    Política: Number(m.score_politica.toFixed(1)),
    Ambiental: Number(m.score_ambiental.toFixed(1)),
  }))

  // Preparar dados para perspectivas
  const dadosPerspectivas = ultimaMetrica
    ? [
        { nome: 'Técnica', score: ultimaMetrica.score_tecnica },
        { nome: 'Política', score: ultimaMetrica.score_politica },
        { nome: 'Ambiental', score: ultimaMetrica.score_ambiental },
        { nome: 'Econômica', score: ultimaMetrica.score_economica },
        { nome: 'Social', score: ultimaMetrica.score_social },
      ]
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🧠 Inteligência do Eduardo</h1>
          <p className="text-slate-300">Acompanhe como Eduardo fica mais inteligente a cada ciclo de análise</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Score Geral */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-blue-100 mb-2">Score Geral</div>
            <div className="text-4xl font-bold mb-1">{scoreAtual.toFixed(1)}%</div>
            <div className="text-2xl">{indicadorTendencia}</div>
          </div>

          {/* Técnica */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-green-100 mb-2">Perspectiva Técnica</div>
            <div className="text-3xl font-bold">{ultimaMetrica?.score_tecnica?.toFixed(0) || '-'}%</div>
          </div>

          {/* Política */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-purple-100 mb-2">Perspectiva Política</div>
            <div className="text-3xl font-bold">{ultimaMetrica?.score_politica?.toFixed(0) || '-'}%</div>
          </div>

          {/* Ambiental */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-amber-100 mb-2">Perspectiva Ambiental</div>
            <div className="text-3xl font-bold">{ultimaMetrica?.score_ambiental?.toFixed(0) || '-'}%</div>
          </div>

          {/* Econômica */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-red-100 mb-2">Perspectiva Econômica</div>
            <div className="text-3xl font-bold">{ultimaMetrica?.score_economica?.toFixed(0) || '-'}%</div>
          </div>
        </div>

        {/* Gráfico de Evolução */}
        <div className="bg-slate-700/50 rounded-lg p-6 mb-8 backdrop-blur border border-slate-600">
          <h2 className="text-2xl font-bold text-white mb-6">📈 Evolução de Inteligência</h2>
          {dadosGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="data" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Score Geral"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line type="monotone" dataKey="Técnica" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Política" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Ambiental" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-8">Sem dados disponíveis ainda</p>
          )}
        </div>

        {/* Gráfico de Perspectivas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Perspectivas Atuais */}
          <div className="bg-slate-700/50 rounded-lg p-6 backdrop-blur border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-6">📊 Perspectivas Atuais</h3>
            {dadosPerspectivas.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosPerspectivas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="nome" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="score" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-8">Sem dados disponíveis</p>
            )}
          </div>

          {/* Métricas Adicionais */}
          <div className="bg-slate-700/50 rounded-lg p-6 backdrop-blur border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-6">📋 Métricas Adicionais</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-600/50 rounded">
                <span className="text-slate-300">Insights Novos</span>
                <span className="text-2xl font-bold text-blue-400">{ultimaMetrica?.insights_novos || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-600/50 rounded">
                <span className="text-slate-300">Coerência Narrativa</span>
                <span className="text-2xl font-bold text-green-400">
                  {ultimaMetrica?.coerencia_narrativa?.toFixed(0) || '-'}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-600/50 rounded">
                <span className="text-slate-300">Profundidade Média</span>
                <span className="text-2xl font-bold text-purple-400">
                  {ultimaMetrica?.profundidade_media?.toFixed(0) || '-'}%
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-600/50 rounded">
                <span className="text-slate-300">Total de Registros</span>
                <span className="text-2xl font-bold text-amber-400">{metricas.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        {estatisticas && (
          <div className="bg-slate-700/50 rounded-lg p-6 backdrop-blur border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-6">📊 Estatísticas Gerais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-600/50 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Score Médio</p>
                <p className="text-2xl font-bold text-white">{estatisticas.score_medio.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-600/50 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Score Máximo</p>
                <p className="text-2xl font-bold text-green-400">{estatisticas.score_maximo.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-600/50 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Score Mínimo</p>
                <p className="text-2xl font-bold text-red-400">{estatisticas.score_minimo.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-600/50 rounded p-4">
                <p className="text-slate-400 text-sm mb-1">Tendência Geral</p>
                <p className="text-2xl font-bold text-blue-400">
                  {estatisticas.tendencia_geral === 'up'
                    ? '📈 Subindo'
                    : estatisticas.tendencia_geral === 'down'
                      ? '📉 Caindo'
                      : '→ Estável'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Eduardo atualiza análises às 06:00 nos dias de semana 📅</p>
          <p className="mt-1">Última atualização: {ultimaMetrica?.data ? new Date(ultimaMetrica.data).toLocaleString('pt-BR') : 'Pendente'}</p>
        </div>
      </div>
    </div>
  )
}
