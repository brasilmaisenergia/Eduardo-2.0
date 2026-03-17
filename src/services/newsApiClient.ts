// newsApiClient.ts - Cliente HTTP para API de Notícias Eduardo
// Path: src/services/newsApiClient.ts

export interface NoticiaAPI {
  id: string
  titulo: string
  conteudo: string
  fonte: string
  url: string
  data_publicacao: string
  data_coleta: string
  perspectiva_tecnica?: string
  perspectiva_politica?: string
  perspectiva_ambiental?: string
  perspectiva_economica?: string
  perspectiva_social?: string
  relevancia?: number
  summary?: string
}

export interface ListaNoticiasResponse {
  total: number
  skip: number
  limit: number
  noticias: NoticiaAPI[]
}

export interface FiltrosNoticias {
  busca?: string
  fonte?: string
  dias?: number
  pagina?: number
  tamanho?: number
}

class NewsAPIClient {
  private baseURL: string
  private retries: number = 3
  private retryDelay: number = 1000

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL
  }

  /**
   * Método auxiliar para fazer requisições com retry logic
   */
  private async fetchComRetry(url: string, options?: RequestInit): Promise<Response> {
    let ultimoErro: Error | null = null

    for (let tentativa = 0; tentativa < this.retries; tentativa++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        })

        if (response.ok) {
          return response
        }

        // Se não ok mas não é erro de rede, não retry
        if (response.status >= 400 && response.status < 500) {
          return response
        }

        ultimoErro = new Error(`HTTP ${response.status}`)
      } catch (erro) {
        ultimoErro = erro as Error
        if (tentativa < this.retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay * (tentativa + 1)))
        }
      }
    }

    throw ultimoErro || new Error('Falha após todas as tentativas')
  }

  /**
   * Listar todas as notícias com opções de filtro
   */
  async listarNoticias(filtros: FiltrosNoticias = {}): Promise<NoticiaAPI[]> {
    try {
      const params = new URLSearchParams()

      if (filtros.dias) params.append('days', String(filtros.dias))
      if (filtros.tamanho) params.append('limit', String(filtros.tamanho))
      if (filtros.pagina) {
        const skip = ((filtros.pagina - 1) * (filtros.tamanho || 20))
        params.append('skip', String(skip))
      }

      const url = `${this.baseURL}/api/noticias?${params.toString()}`
      const response = await this.fetchComRetry(url)

      if (!response.ok) {
        console.error(`Erro ao listar notícias: ${response.status}`)
        return []
      }

      const data = await response.json()
      return data.noticias || data.news || []
    } catch (erro) {
      console.error('Erro ao listar notícias:', erro)
      return []
    }
  }

  /**
   * Buscar notícias por palavra-chave
   */
  async buscar(termo: string, tamanho: number = 20): Promise<NoticiaAPI[]> {
    try {
      const params = new URLSearchParams()
      params.append('search', termo)
      params.append('limit', String(tamanho))

      const url = `${this.baseURL}/api/noticias/buscar?${params.toString()}`
      const response = await this.fetchComRetry(url)

      if (!response.ok) return []

      const data = await response.json()
      return data.noticias || data.news || []
    } catch (erro) {
      console.error('Erro ao buscar notícias:', erro)
      return []
    }
  }

  /**
   * Filtrar notícias por fonte
   */
  async porFonte(fonte: string, tamanho: number = 20): Promise<NoticiaAPI[]> {
    try {
      const url = `${this.baseURL}/api/noticias/source/${fonte}?limit=${tamanho}`
      const response = await this.fetchComRetry(url)

      if (!response.ok) return []

      const data = await response.json()
      return data.noticias || data.news || []
    } catch (erro) {
      console.error(`Erro ao buscar notícias de ${fonte}:`, erro)
      return []
    }
  }

  /**
   * Obter notícias mais recentes
   */
  async obterRecentes(tamanho: number = 10): Promise<NoticiaAPI[]> {
    try {
      const url = `${this.baseURL}/api/noticias/latest?limit=${tamanho}`
      const response = await this.fetchComRetry(url)

      if (!response.ok) return []

      const data = await response.json()
      return data.noticias || data.news || []
    } catch (erro) {
      console.error('Erro ao obter notícias recentes:', erro)
      return []
    }
  }

  /**
   * Obter detalhes de uma notícia específica
   */
  async obterPorId(id: string): Promise<NoticiaAPI | null> {
    try {
      const url = `${this.baseURL}/api/noticias/${id}`
      const response = await this.fetchComRetry(url)

      if (!response.ok) return null

      const data = await response.json()
      return data || null
    } catch (erro) {
      console.error(`Erro ao obter notícia ${id}:`, erro)
      return null
    }
  }

  /**
   * Atualizar notícias do backend
   */
  async atualizar(fonte?: string): Promise<{ success: boolean; mensagem: string; total?: number }> {
    try {
      const body: any = {}
      if (fonte) body.fonte = fonte

      const url = `${this.baseURL}/api/noticias/atualizar`
      const response = await this.fetchComRetry(url, {
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        return {
          success: false,
          mensagem: `Erro ao atualizar: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        mensagem: data.mensagem || 'Atualizado com sucesso',
        total: data.total || data.noticiasAtualizadas,
      }
    } catch (erro) {
      console.error('Erro ao atualizar notícias:', erro)
      return {
        success: false,
        mensagem: erro instanceof Error ? erro.message : 'Erro desconhecido',
      }
    }
  }

  /**
   * Verificar saúde da API
   */
  async verificarSaude(): Promise<boolean> {
    try {
      const url = `${this.baseURL}/api/health`
      const response = await this.fetchComRetry(url)
      return response.ok
    } catch (erro) {
      console.error('Erro ao verificar saúde da API:', erro)
      return false
    }
  }

  /**
   * Obter estatísticas
   */
  async obterEstatisticas(): Promise<{ total: number; fontes: Record<string, number> }> {
    try {
      const url = `${this.baseURL}/api/noticias/stats`
      const response = await this.fetchComRetry(url)

      if (!response.ok) {
        return { total: 0, fontes: {} }
      }

      const data = await response.json()
      return data
    } catch (erro) {
      console.error('Erro ao obter estatísticas:', erro)
      return { total: 0, fontes: {} }
    }
  }
}

// Exportar instância singleton
export const newsApiClient = new NewsAPIClient(
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
)

export default newsApiClient
