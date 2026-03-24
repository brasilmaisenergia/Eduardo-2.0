// supabaseClient.ts - VERSÃO 2 COM INTELIGÊNCIA MONITORING
// Path: src/lib/supabaseClient.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL environment variable is not defined')
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is not defined')
}

let supabase: SupabaseClient | null = null

export function initializeSupabase(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  return supabase
}

export const getSupabase = (): SupabaseClient => {
  return initializeSupabase()
}

// ============================================
// INTERFACES
// ============================================

export interface Noticia {
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
}

export interface MetricaInteligencia {
  id?: string
  data?: string
  semana: number
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
  contradicoes_detectadas?: number
  conexoes_descobertas?: number
  created_at?: string
}

// ============================================
// OPERAÇÕES NOTICIAS (Existentes)
// ============================================

export async function buscarTodasAsNoticias(
  pagina: number = 1,
  tamanho: number = 20
): Promise<Noticia[]> {
  try {
    const sb = getSupabase()
    const inicio = (pagina - 1) * tamanho

    const { data, error } = await sb
      .from('noticias')
      .select('*')
      .order('data_publicacao', { ascending: false })
      .range(inicio, inicio + tamanho - 1)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao buscar noticias:', err)
    return []
  }
}

export async function buscarNoticiaById(id: string): Promise<Noticia | null> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb.from('noticias').select('*').eq('id', id).single()

    if (error) throw error
    return data || null
  } catch (err) {
    console.error('Erro ao buscar noticia:', err)
    return null
  }
}

export async function buscarNoticiasPorFonte(fonte: string): Promise<Noticia[]> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('noticias')
      .select('*')
      .eq('fonte', fonte)
      .order('data_publicacao', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao buscar noticias por fonte:', err)
    return []
  }
}

export async function buscarNoticiasPorStakeholder(stakeholder: string): Promise<Noticia[]> {
  try {
    const sb = getSupabase()
    // Busca em qualquer perspectiva que contenha o stakeholder
    const { data, error } = await sb
      .from('noticias')
      .select('*')
      .or(
        `perspectiva_tecnica.ilike.%${stakeholder}%,perspectiva_politica.ilike.%${stakeholder}%,perspectiva_ambiental.ilike.%${stakeholder}%,perspectiva_economica.ilike.%${stakeholder}%,perspectiva_social.ilike.%${stakeholder}%`
      )

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao buscar noticias por stakeholder:', err)
    return []
  }
}

export async function buscarNoticiasPorRelevancia(minRelevancia: number = 0.7): Promise<Noticia[]> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from('noticias')
      .select('*')
      .gte('relevancia', minRelevancia)
      .order('relevancia', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao buscar noticias por relevancia:', err)
    return []
  }
}

export async function buscarNoticiaRecentes(dias: number = 7): Promise<Noticia[]> {
  try {
    const sb = getSupabase()
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - dias)

    const { data, error } = await sb
      .from('noticias')
      .select('*')
      .gte('data_publicacao', dataLimite.toISOString())
      .order('data_publicacao', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Erro ao buscar noticias recentes:', err)
    return []
  }
}

export async function inserirNoticia(noticia: Noticia): Promise<string | null> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb.from('noticias').insert([noticia]).select()

    if (error) throw error
    return data?.[0]?.id || null
  } catch (err) {
    console.error('Erro ao inserir noticia:', err)
    return null
  }
}

export async function atualizarNoticia(id: string, atualizacoes: Partial<Noticia>): Promise<boolean> {
  try {
    const sb = getSupabase()
    const { error } = await sb.from('noticias').update(atualizacoes).eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Erro ao atualizar noticia:', err)
    return false
  }
}

export async function deletarNoticia(id: string): Promise<boolean> {
  try {
    const sb = getSupabase()
    const { error } = await sb.from('noticias').delete().eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Erro ao deletar noticia:', err)
    return false
  }
}

export async function contarNoticiasPorFonte(): Promise<Record<string, number>> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb.from('noticias').select('fonte')

    if (error) throw error

    const contagem = (data || []).reduce(
      (acc, item) => {
        acc[item.fonte] = (acc[item.fonte] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return contagem
  } catch (err) {
    console.error('Erro ao contar noticias por fonte:', err)
    return {}
  }
}

export function inscreverEmMudancas(callback: (payload: any) => void): (() => void) | null {
  try {
    const sb = getSupabase()

    const subscription = sb
      .channel('noticias-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'noticias' },
        (payload) => {
          console.log('Mudança detectada em noticias:', payload)
          callback(payload)
        }
      )
      .subscribe()

    // Retornar função para desinscrever
    return () => {
      sb.removeChannel(subscription)
    }
  } catch (err) {
    console.error('Erro ao inscrever em mudancas:', err)
    return null
  }
}

// ============================================
// OPERAÇÕES INTELIGÊNCIA (NOVO)
// ============================================

/**
 * Registra métrica de inteligência após ciclo de análise
 */
export async function registrarMetricaInteligencia(metrica: MetricaInteligencia): Promise<boolean> {
  try {
    const sb = getSupabase()

    const dadosParaInserir = {
      data: new Date().toISOString(),
      semana: metrica.semana,
      score_geral: Math.min(100, Math.max(0, metrica.score_geral)),
      score_tecnica: Math.min(100, Math.max(0, metrica.score_tecnica)),
      score_politica: Math.min(100, Math.max(0, metrica.score_politica)),
      score_ambiental: Math.min(100, Math.max(0, metrica.score_ambiental)),
      score_economica: Math.min(100, Math.max(0, metrica.score_economica)),
      score_social: Math.min(100, Math.max(0, metrica.score_social)),
      insights_novos: metrica.insights_novos || 0,
      coerencia_narrativa: Math.min(100, Math.max(0, metrica.coerencia_narrativa)),
      profundidade_media: Math.min(100, Math.max(0, metrica.profundidade_media)),
      tendencia: metrica.tendencia || 'stable',
      contradicoes_detectadas: metrica.contradicoes_detectadas || 0,
      conexoes_descobertas: metrica.conexoes_descobertas || 0,
    }

    const { error } = await sb.from('performance_inteligencia').insert([dadosParaInserir])

    if (error) {
      console.error('Erro ao registrar métrica de inteligência:', error)
      return false
    }

    console.log('✅ Métrica de inteligência registrada:', dadosParaInserir.score_geral)
    return true
  } catch (err) {
    console.error('Erro ao registrar inteligência:', err)
    return false
  }
}

/**
 * Obtém tendência de inteligência dos últimos N dias
 */
export async function obterTendenciaInteligencia(dias: number = 30): Promise<MetricaInteligencia[]> {
  try {
    const sb = getSupabase()
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - dias)

    const { data, error } = await sb
      .from('performance_inteligencia')
      .select('*')
      .gte('data', dataLimite.toISOString())
      .order('data', { ascending: true })

    if (error) throw error

    return data || []
  } catch (err) {
    console.error('Erro ao obter tendência de inteligência:', err)
    return []
  }
}

/**
 * Obtém última métrica registrada
 */
export async function obterUltimaMetricaInteligencia(): Promise<MetricaInteligencia | null> {
  try {
    const sb = getSupabase()

    const { data, error } = await sb
      .from('performance_inteligencia')
      .select('*')
      .order('data', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = nenhuma linha

    return data || null
  } catch (err) {
    console.error('Erro ao obter última métrica:', err)
    return null
  }
}

/**
 * Obtém estatísticas de inteligência (resumo geral)
 */
export async function obterEstatisticasInteligencia(): Promise<{
  score_medio: number
  score_maximo: number
  score_minimo: number
  total_registros: number
  tendencia_geral: 'up' | 'down' | 'stable'
} | null> {
  try {
    const sb = getSupabase()

    const { data, error } = await sb.from('performance_inteligencia').select('score_geral')

    if (error) throw error

    if (!data || data.length === 0) {
      return null
    }

    const scores = data.map((d) => d.score_geral)
    const media = scores.reduce((a, b) => a + b, 0) / scores.length
    const maximo = Math.max(...scores)
    const minimo = Math.min(...scores)

    // Determinar tendência (últimos 5 registros)
    const ultimos = scores.slice(-5)
    const tendencia_geral =
      ultimos[ultimos.length - 1] > media ? 'up' : ultimos[ultimos.length - 1] < media ? 'down' : 'stable'

    return {
      score_medio: media,
      score_maximo: maximo,
      score_minimo: minimo,
      total_registros: scores.length,
      tendencia_geral,
    }
  } catch (err) {
    console.error('Erro ao obter estatísticas:', err)
    return null
  }
}

/**
 * Inscrever em mudanças de inteligência em tempo real
 */
export function inscreverEmMudancasInteligencia(callback: (payload: any) => void): (() => void) | null {
  try {
    const sb = getSupabase()

    const subscription = sb
      .channel('inteligencia-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'performance_inteligencia' },
        (payload) => {
          console.log('Nova métrica de inteligência registrada:', payload)
          callback(payload)
        }
      )
      .subscribe()

    return () => {
      sb.removeChannel(subscription)
    }
  } catch (err) {
    console.error('Erro ao inscrever em mudanças de inteligência:', err)
    return null
  }
}

export const supabaseClient = getSupabase()

export default getSupabase()
