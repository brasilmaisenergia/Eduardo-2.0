/**
 * Notícias Análise
 * Dashboard para análise de notícias com filtros de stakeholder
 */

import { useState } from 'react'

interface Noticia {
    id: string
    titulo: string
    resumo: string
    relevancia: number
    stakeholders: string[]
    analise: string
}

const noticiasExemplo: Noticia[] = [
  {
        id: '1',
        titulo: 'Novo investimento em energia renovável',
        resumo: 'Brasil investe em novas plantas de energia solar',
        relevancia: 95,
        stakeholders: ['Governo', 'Investidores'],
        analise: 'Alto impacto positivo na sustentabilidade energética'
  },
  {
        id: '2',
        titulo: 'Mudanças na legislação energética',
        resumo: 'Alterações nas regulamentações do setor',
        relevancia: 87,
        stakeholders: ['Órgãos Reguladores', 'Empresas'],
        analise: 'Afeta significativamente o mercado de energia'
  }
  ]

export function NoticiasAnalise() {
    const [noticias] = useState<Noticia[]>(noticiasExemplo)
    const [expandidos, setExpandidos] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
        const novo = new Set(expandidos)
        if (novo.has(id)) {
                novo.delete(id)
        } else {
                novo.add(id)
        }
        setExpandidos(novo)
  }

  return (
        <div className="p-6">
              <h2 className="text-3xl font-bold mb-6">Notícias Analisadas</h2>h2>
              <div className="space-y-4">
                {noticias.map((noticia) => (
                    <div key={noticia.id} className="border rounded-lg p-4 bg-white shadow">
                                <div
                                                className="cursor-pointer"
                                                onClick={() => toggleExpand(noticia.id)}
                                              >
                                              <div className="flex justify-between items-center">
                                                              <h3 className="text-xl font-semibold">{noticia.titulo}</h3>h3>
                                                              <div className="flex items-center gap-2">
                                                                                <span className="text-sm font-bold text-blue-600">
                                                                                  {noticia.relevancia}%
                                                                                </span>span>
                                                                                <span>{expandidos.has(noticia.id) ? '▼' : '▶'}</span>span>
                                                              </div>div>
                                              </div>div>
                                              <p className="text-gray-600 mt-2">{noticia.resumo}</p>p>
                                </div>div>
                      {expandidos.has(noticia.id) && (
                                    <div className="mt-4 pt-4 border-t">
                                                    <h4 className="font-semibold mb-2">Análise</h4>h4>
                                                    <p className="text-gray-700">{noticia.analise}</p>p>
                                                    <div className="mt-3">
                                                                      <p className="text-sm font-semibold mb-2">Stakeholders:</p>p>
                                                                      <div className="flex flex-wrap gap-2">
                                                                        {noticia.stakeholders.map((s) => (
                                                            <span
                                                                                      key={s}
                                                                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                                                                                    >
                                                              {s}
                                                            </span>span>
                                                          ))}
                                                                      </div>div>
                                                    </div>div>
                                    </div>div>
                                )}
                    </div>div>
                  ))}
              </div>div>
        </div>div>
      )
}

export default NoticiasAnalise</div>
