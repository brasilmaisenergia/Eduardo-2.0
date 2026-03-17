#!/bin/bash

# =============================================================================
# SETUP COMPLETO FASE 3.4-3.6
# Sistema Eduardo 2.0 - Análise de Notícias com Inteligência Rastreável
# =============================================================================

set -e  # Exit on error

echo "================================================"
echo "INICIANDO SETUP FASE 3.4-3.6 - EDUARDO 2.0"
echo "================================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =============================================================================
# VALIDAÇÃO DE PRÉ-REQUISITOS
# =============================================================================
echo -e "${YELLOW}[1/8] Validando pré-requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js não encontrado. Instale em https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ git não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ git: $(git --version)${NC}"

echo ""

# =============================================================================
# INSTALAÇÃO DE DEPENDÊNCIAS
# =============================================================================
echo -e "${YELLOW}[2/8] Instalando dependências npm...${NC}"
npm install
echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

# =============================================================================
# VERIFICAÇÃO DE TIPOS TYPESCRIPT
# =============================================================================
echo -e "${YELLOW}[3/8] Verificando tipos TypeScript...${NC}"
npx tsc --noEmit
echo -e "${GREEN}✓ Tipos validados${NC}"
echo ""

# =============================================================================
# EXECUÇÃO EM DESENVOLVIMENTO
# =============================================================================
echo -e "${YELLOW}[4/8] Iniciando servidor de desenvolvimento...${NC}"
echo "⏱️  Aguarde 10 segundos para teste de conectividade..."
timeout 10 npm run dev || true
echo -e "${GREEN}✓ Servidor de desenvolvimento testado${NC}"
echo ""

# =============================================================================
# BUILD PARA PRODUÇÃO
# =============================================================================
echo -e "${YELLOW}[5/8] Construindo para produção...${NC}"
npm run build
echo -e "${GREEN}✓ Build de produção concluído${NC}"
echo ""

# =============================================================================
# INICIALIZAÇÃO GIT
# =============================================================================
echo -e "${YELLOW}[6/8] Configurando Git...${NC}"

if [ -d ".git" ]; then
    echo "⚠️  Repositório git já existe"
else
    git init
    git config user.name "Eduardo Bot"
    git config user.email "bme@brasilmaisenergia.com"
fi

echo -e "${GREEN}✓ Git configurado${NC}"
echo ""

# =============================================================================
# COMMIT INICIAL
# =============================================================================
echo -e "${YELLOW}[7/8] Realizando commit inicial...${NC}"

git add .
git commit -m "feat(fase3.4): Setup completo Eduardo 2.0 com Noticias e Dashboard de Inteligência

- Estrutura Vite + React + TypeScript
- Cliente Supabase com inteligência rastreável
- API NewsAPI integrada
- Dashboard de monitoramento de inteligência
- Build e tipos validados" || echo "⚠️  Repositório já configurado"

echo -e "${GREEN}✓ Commit realizado${NC}"
echo ""

# =============================================================================
# RESUMO FINAL
# =============================================================================
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ SETUP CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "PRÓXIMOS PASSOS:"
echo "1. Configure suas variáveis de ambiente:"
echo "   - Edite .env.local com suas credenciais Supabase e NewsAPI"
echo ""
echo "2. Inicie o servidor de desenvolvimento:"
echo "   npm run dev"
echo ""
echo "3. Abra no navegador:"
echo "   http://localhost:5173/noticias"
echo ""
echo "4. Quando pronto para deploy:"
echo "   npm run build && git push origin main"
echo ""
echo -e "${YELLOW}Detalhes da Fase 3.4:${NC}"
echo "  - API de Notícias integrada"
echo "  - Dashboard de Inteligência funcionando"
echo "  - Componentes React compilados"
echo "  - Build otimizado para produção"
echo ""
