/**
 * Eduardo Service
 * Service para comunicação com Eduardo (assistente de IA)
 */

interface EduardoResponse {
  success: boolean
  response: string
  timestamp: string
  error?: string
}

export class EduardoService {
  private apiUrl = import.meta.env.VITE_API_URL || 'https://eduardo-2-0.vercel.app'

  /**
   * Enviar pergunta para Eduardo e receber resposta
   * @param message - Pergunta/mensagem para Eduardo
   * @param context - Contexto adicional (opcional)
   * @param userId - ID do usuário (opcional)
   */
  async askEduardo(
    message: string,
    context?: string,
    userId?: string
  ): Promise<EduardoResponse> {
    try {
      if (!message || message.trim().length === 0) {
        return {
          success: false,
          response: 'Por favor, forneça uma pergunta.',
          timestamp: new Date().toISOString(),
          error: 'Empty message',
        }
      }

      const response = await fetch(`${this.apiUrl}/api/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          context: context || '',
          userId: userId || 'anonymous',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          response: 'Desculpe, não consegui processar sua pergunta.',
          timestamp: new Date().toISOString(),
          error: errorData.error || `HTTP ${response.status}`,
        }
      }

      const data: EduardoResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error communicating with Eduardo:', error)
      return {
        success: false,
        response: 'Desculpe, ocorreu um erro ao comunicar com Eduardo.',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Enviar análise de notícia para Eduardo
   * @param titulo - Título da notícia
   * @param conteudo - Conteúdo da notícia
   * @param fonte - Fonte da notícia
   */
  async analisarNoticia(
    titulo: string,
    conteudo: string,
    fonte: string
  ): Promise<EduardoResponse> {
    const context = `
Analisando notícia de: ${fonte}

Título: ${titulo}

Conteúdo:
${conteudo}

Por favor, forneça uma análise desta notícia considerando:
1. Impacto técnico
2. Perspectiva política
3. Aspectos ambientais
4. Impacto econômico
5. Perspectiva social
    `.trim()

    return this.askEduardo(
      `Qual é sua análise sobre esta notícia: "${titulo}"?`,
      context
    )
  }

  /**
   * Gerar resumo executivo
   * @param dados - Dados para sumarizar
   */
  async gerarResumo(dados: string): Promise<EduardoResponse> {
    return this.askEduardo(
      'Por favor, gere um resumo executivo desses dados:',
      dados
    )
  }

  /**
   * Obter recomendações
   * @param tema - Tema para recomendações
   */
  async obterRecomendacoes(tema: string): Promise<EduardoResponse> {
    return this.askEduardo(
      `Quais são suas recomendações sobre ${tema}?`,
      `Contexto: Estamos analisando ${tema} e gostaria de suas recomendações baseadas em dados e análise atual.`
    )
  }
}

// Exportar instância singleton
export const eduardoService = new EduardoService()
