import { supabaseClient } from '../lib/supabaseClient';

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      id: string;
      name: string;
    };
    content?: string;
}

class NewsApiClient {
    private maxRetries = 3;
    private retryDelay = 1000;

  async fetchComRetry(
        url: string,
        options?: RequestInit,
        retries: number = 0
      ): Promise<Response> {
        try {
                const response = await fetch(url, options);
        if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
                return response;
        } catch (error) {
                if (retries < this.maxRetries) {
                          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                          return this.fetchComRetry(url, options, retries + 1);
                }
                throw error;
        }
  }

  async listarNoticias(filtros?: {
        fonte?: string;
        diasAtras?: number;
  }): Promise<NewsItem[]> {
        try {
                // Query Supabase directly
          let query = supabaseClient
                  .from('noticias')
                  .select('*');

          // Apply filters if provided
          if (filtros?.fonte && filtros.fonte !== 'todas') {
                    query = query.eq('source', filtros.fonte);
          }

          if (filtros?.diasAtras && filtros.diasAtras > 0) {
                    const dataLimite = new Date();
                    dataLimite.setDate(dataLimite.getDate() - filtros.diasAtras);
                    query = query.gte('publishedAt', dataLimite.toISOString());
          }

          // Order by published date descending
          query = query.order('publishedAt', { ascending: false });

          const { data, error } = await query;

          if (error) {
                    console.error('Erro ao buscar noticias do Supabase:', error);
                    throw new Error(error.message);
          }

          return data || [];
        } catch (error) {
                console.error('Erro ao listar notícias:', error);
                throw error;
        }
  }

  async buscarNoticias(termo: string): Promise<NewsItem[]> {
        try {
                const { data, error } = await supabaseClient
                  .from('noticias')
                  .select('*')
                  .ilike('title', `%${termo}%`)
                  .order('publishedAt', { ascending: false });

          if (error) {
                    console.error('Erro ao buscar noticias:', error);
                    throw new Error(error.message);
          }

          return data || [];
        } catch (error) {
                console.error('Erro ao buscar notícias:', error);
                throw error;
        }
  }

  async obterNoticia(id: string): Promise<NewsItem | null> {
        try {
                const { data, error } = await supabaseClient
                  .from('noticias')
                  .select('*')
                  .eq('id', id)
                  .single();

          if (error) {
                    console.error('Erro ao obter noticia:', error);
                    return null;
          }

          return data || null;
        } catch (error) {
                console.error('Erro ao obter notícia:', error);
                return null;
        }
  }

  async listarFontes(): Promise<string[]> {
        try {
                const { data, error } = await supabaseClient
                  .from('noticias')
                  .select('source')
                  .neq('source', null);

          if (error) {
                    console.error('Erro ao listar fontes:', error);
                    return [];
          }

          // Extract unique sources
          const fontes = [...new Set(data?.map(item => item.source) || [])];
                return fontes as string[];
        } catch (error) {
                console.error('Erro ao listar fontes:', error);
                return [];
        }
  }
}

export default new NewsApiClient();
