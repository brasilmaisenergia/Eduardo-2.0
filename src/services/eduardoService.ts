/**
 * Eduardo Service
  * Serviço para comunicação com a API de Eduardo
   */

   interface EduardoResponse {
     success: boolean
       response?: string
         error?: string
           timestamp?: string
           }

           class EduardoService {
             private apiUrl = import.meta.env.VITE_API_URL || '/api'

               async askEduardo(
                   message: string,
                       context?: string,
                           userId?: string
                             ): Promise<EduardoResponse> {
                                 try {
                                       const response = await fetch(`${this.apiUrl}/respond`, {
                                               method: 'POST',
                                                       headers: {
                                                                 'Content-Type': 'application/json',
                                                                         },
                                                                                 body: JSON.stringify({
                                                                                           message,
                                                                                                     context: context || '',
                                                                                                               userId: userId || 'anonymous',
                                                                                                                       }),
                                                                                                                             })
                                                                                                                             
                                                                                                                                   if (!response.ok) {
                                                                                                                                           const errorData = await response.json().catch(() => ({}))
                                                                                                                                                   return {
                                                                                                                                                             success: false,
                                                                                                                                                                       error: errorData.error || 'Erro ao conectar com o servidor',
                                                                                                                                                                               }
                                                                                                                                                                                     }
                                                                                                                                                                                     
                                                                                                                                                                                           const data: EduardoResponse = await response.json()
                                                                                                                                                                                                 return data
                                                                                                                                                                                                     } catch (erro) {
                                                                                                                                                                                                           console.error('Erro ao chamar API de Eduardo:', erro)
                                                                                                                                                                                                                 return {
                                                                                                                                                                                                                         success: false,
                                                                                                                                                                                                                                 error: 'Erro ao comunicar com o servidor. Verifique sua conexão.',
                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                           }
                                                                                                                                                                                                                                             }
                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                               async analisarNoticia(
                                                                                                                                                                                                                                                   titulo: string,
                                                                                                                                                                                                                                                       conteudo: string
                                                                                                                                                                                                                                                         ): Promise<EduardoResponse> {
                                                                                                                                                                                                                                                             const message = `Analise esta notícia:\n\nTítulo: ${titulo}\n\nConteúdo: ${conteudo}`
                                                                                                                                                                                                                                                                 return this.askEduardo(message)
                                                                                                                                                                                                                                                                   }
                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                     async gerarResumo(texto: string): Promise<EduardoResponse> {
                                                                                                                                                                                                                                                                         const message = `Gere um resumo conciso do seguinte texto:\n\n${texto}`
                                                                                                                                                                                                                                                                             return this.askEduardo(message)
                                                                                                                                                                                                                                                                               }
                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                 async obterRecomendacoes(topico: string): Promise<EduardoResponse> {
                                                                                                                                                                                                                                                                                     const message = `Forneça recomendações e insights sobre: ${topico}`
                                                                                                                                                                                                                                                                                         return this.askEduardo(message)
                                                                                                                                                                                                                                                                                           }
                                                                                                                                                                                                                                                                                           }
                                                                                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                                           // Singleton
                                                                                                                                                                                                                                                                                           export const eduardoService = new EduardoService()
