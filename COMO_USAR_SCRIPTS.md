# 🚀 Como Usar os Scripts de Setup

Criei **dois scripts** para você escolher qual prefere usar:

## ✅ Opção 1: PowerShell (Recomendado)

### Arquivo: `EXECUTE_FASE_3.4.ps1`

**Passo 1: Abra o PowerShell**
- Pressione `Windows + X`
- Selecione "Windows PowerShell"
- OU: "Windows Terminal" (melhor)

**Passo 2: Navegue para a pasta**
```powershell
cd "C:\Users\claud\OneDrive\Documentos\01- Brasil mais energia\Eduardo\bme-frontend"
```

**Passo 3: Copie e cole este comando:**
```powershell
powershell -ExecutionPolicy Bypass -File EXECUTE_FASE_3.4.ps1
```

**O que acontece:**
- ✓ Valida Node.js e npm
- ✓ Verifica arquivos
- ✓ Executa `npm install`
- ✓ Gera log com detalhes
- ✓ Mostra relatório colorido

**Saída esperada:**
```
================================================================================
✅ FASE 3.4 - SETUP CONCLUÍDO COM SUCESSO!
================================================================================

📊 RESUMO DA EXECUÇÃO:
  ✓ Node.js: OK
  ✓ npm: OK
  ✓ Estrutura: OK
  ✓ npm install: OK
  ✓ node_modules: XXX módulos
  ✓ Código TypeScript: 1444 linhas
```

---

## ✅ Opção 2: CMD (Mais Simples)

### Arquivo: `EXECUTE_FASE_3.4.bat`

**Passo 1: Abra o CMD**
- Pressione `Windows + R`
- Digite `cmd`
- Pressione Enter

**Passo 2: Navegue para a pasta**
```cmd
cd "C:\Users\claud\OneDrive\Documentos\01- Brasil mais energia\Eduardo\bme-frontend"
```

**Passo 3: Copie e cole este comando:**
```cmd
EXECUTE_FASE_3.4.bat
```

**O que acontece:**
- ✓ Mesmas validações do PowerShell
- ✓ Interface mais simples
- ✓ Gera log
- ✓ Aguarda seu comando no final

---

## 📝 O Que os Scripts Fazem

### Etapas Executadas:

1. **[1/4] Validação de Pré-requisitos**
   - Verifica se Node.js está instalado
   - Verifica se npm está instalado
   - Mostra versões

2. **[2/4] Verificação de Arquivos**
   - Confere se package.json existe
   - Confere se tsconfig.json existe
   - Confere se todos os arquivos críticos estão lá

3. **[3/4] Instalação de Dependências**
   - Executa `npm install`
   - Instala React, TypeScript, Vite, etc.
   - ⏱️ Leva 2-3 minutos (depende da internet)

4. **[4/4] Validação Final**
   - Confere se node_modules foi criado
   - Conta módulos instalados
   - Mostra relatório final

---

## 📊 Logs Gerados

Depois de rodar o script, você terá:

### PowerShell gera:
- `setup_log_YYYY-MM-DD_HH-MM-SS.txt` - Log detalhado
- `setup_screenshots_YYYY-MM-DD_HH-MM-SS/` - Pasta (preparada)

### CMD gera:
- `setup_log_DDMMMYY_HHmm.txt` - Log detalhado

**Abra o arquivo de log para ver:**
- Versões do Node.js e npm
- Quais arquivos foram validados
- Output completo do npm install
- Status final

---

## ✨ Depois Que o Script Terminar

Quando você ver a mensagem de sucesso:

```
✅ FASE 3.4 - SETUP CONCLUÍDO COM SUCESSO!
```

Execute o servidor:

```bash
npm run dev
```

E abra no navegador:
```
http://localhost:5173/noticias
```

---

## ⚠️ Se Der Erro

### Erro 1: "Node.js não encontrado"
**Solução:** Instale Node.js em https://nodejs.org

### Erro 2: "ExecutionPolicy Bypass"
**Solução:** Use CMD (Opção 2) em vez de PowerShell

### Erro 3: "npm install falhou"
**Solução:**
- Verifique conexão com internet
- Tente novamente
- Se persistir, avise para eu ajudar

### Erro 4: "Arquivo não encontrado"
**Solução:** Certifique-se que você está na pasta correta

---

## 🎯 Qual Usar?

| Situação | Use |
|----------|-----|
| Primeira vez | **PowerShell** (mais informações) |
| Não tem PowerShell | **CMD** (mais simples) |
| Windows 11 | **PowerShell** (Windows Terminal) |
| Windows 10 | **CMD** (mais compatível) |

---

## 📋 Checklist Antes de Rodar

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm funcionando (`npm --version`)
- [ ] Na pasta correta (`cd C:\Users\claud\...`)
- [ ] Terminal aberto (PowerShell ou CMD)
- [ ] Arquivo `.env.local` na pasta

---

## 🚀 Resumo Rápido

```bash
# 1. Abra PowerShell/CMD
# 2. Navegue para a pasta
cd "C:\Users\claud\OneDrive\Documentos\01- Brasil mais energia\Eduardo\bme-frontend"

# 3. Execute O SCRIPT (escolha um):

# Opção PowerShell:
powershell -ExecutionPolicy Bypass -File EXECUTE_FASE_3.4.ps1

# Opção CMD:
EXECUTE_FASE_3.4.bat

# 4. Aguarde 2-3 minutos
# 5. Veja a mensagem de sucesso
# 6. Abra o arquivo de log
# 7. Execute: npm run dev
```

---

**Pronto! Qualquer dúvida, me avisa! 🎯**
