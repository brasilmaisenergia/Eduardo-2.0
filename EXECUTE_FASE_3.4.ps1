# ============================================================================
# SCRIPT FASE 3.4 - SETUP AUTOMÁTICO COM FEEDBACK
# Eduardo 2.0 - Sistema de Análise de Notícias
# ============================================================================

# Cores para output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

Write-Host "$Green" + "=" * 80 + "$Reset"
Write-Host "$Green█ INICIANDO FASE 3.4 - SETUP AUTOMÁTICO$Reset"
Write-Host "$Green" + "=" * 80 + "$Reset"
Write-Host ""

# Variáveis
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "setup_log_$timestamp.txt"
$screenshotFolder = "setup_screenshots_$timestamp"

# Criar pasta para screenshots
New-Item -ItemType Directory -Force -Path $screenshotFolder | Out-Null

# Iniciar log
"FASE 3.4 - SETUP LOG" | Out-File -FilePath $logFile -Encoding UTF8
"Data: $(Get-Date)" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"Computador: $env:COMPUTERNAME" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"Usuário: $env:USERNAME" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"---" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"" | Out-File -FilePath $logFile -Encoding UTF8 -Append

# ============================================================================
# [1] VALIDAÇÃO DE PRÉ-REQUISITOS
# ============================================================================
Write-Host "$Yellow[1/5] Validando pré-requisitos...$Reset"

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "$Green✓ Node.js: $nodeVersion$Reset"
    "Node.js: $nodeVersion" | Out-File -FilePath $logFile -Encoding UTF8 -Append
} catch {
    Write-Host "$Red✗ Node.js não encontrado! Instale em https://nodejs.org$Reset"
    "ERRO: Node.js não encontrado" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "$Green✓ npm: $npmVersion$Reset"
    "npm: $npmVersion" | Out-File -FilePath $logFile -Encoding UTF8 -Append
} catch {
    Write-Host "$Red✗ npm não encontrado!$Reset"
    "ERRO: npm não encontrado" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

Write-Host ""

# ============================================================================
# [2] VERIFICAR PASTA
# ============================================================================
Write-Host "$Yellow[2/5] Verificando estrutura de arquivos...$Reset"

$requiredFiles = @(
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    ".env.local",
    "index.html"
)

$missingFiles = 0
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "$Green  ✓ $file$Reset"
        "ARQUIVO: $file - OK" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    } else {
        Write-Host "$Red  ✗ FALTA: $file$Reset"
        "ARQUIVO: $file - FALTANDO" | Out-File -FilePath $logFile -Encoding UTF8 -Append
        $missingFiles++
    }
}

if ($missingFiles -gt 0) {
    Write-Host "$Red✗ Faltam $missingFiles arquivos essenciais!$Reset"
    exit 1
}

Write-Host "$Green✓ Estrutura validada$Reset"
Write-Host ""

# ============================================================================
# [3] INSTALAR DEPENDÊNCIAS
# ============================================================================
Write-Host "$Yellow[3/5] Instalando dependências npm..."
Write-Host "(Isso pode levar 2-3 minutos)$Reset"

$npmInstallStart = Get-Date
$npmInstallOutput = npm install 2>&1
$npmInstallTime = (Get-Date) - $npmInstallStart

Write-Host "$Green✓ Instalação concluída em $($npmInstallTime.TotalSeconds) segundos$Reset"
"npm install output: $npmInstallOutput" | Out-File -FilePath $logFile -Encoding UTF8 -Append

Write-Host ""

# ============================================================================
# [4] VALIDAÇÃO PÓS-INSTALL
# ============================================================================
Write-Host "$Yellow[4/5] Validando node_modules...$Reset"

if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory | Measure-Object).Count
    Write-Host "$Green✓ $moduleCount módulos instalados$Reset"
    "$moduleCount módulos instalados" | Out-File -FilePath $logFile -Encoding UTF8 -Append
} else {
    Write-Host "$Red✗ node_modules não encontrado!$Reset"
    "ERRO: npm install falhou" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

Write-Host ""

# ============================================================================
# [5] INFORMAÇÕES DO PROJETO
# ============================================================================
Write-Host "$Yellow[5/5] Coletando informações do projeto...$Reset"

# Contar arquivos TypeScript
$tsFiles = (Get-ChildItem "src" -Filter "*.ts*" -Recurse | Measure-Object).Count
Write-Host "$Green✓ Arquivos TypeScript: $tsFiles$Reset"
"Arquivos TypeScript: $tsFiles" | Out-File -FilePath $logFile -Encoding UTF8 -Append

# Contar linhas de código
$linesOfCode = 0
Get-ChildItem "src" -Filter "*.ts*" -Recurse | ForEach-Object {
    $linesOfCode += @(Get-Content $_.FullName | Measure-Object -Line).Lines
}
Write-Host "$Green✓ Linhas de código: $linesOfCode$Reset"
"Linhas de código: $linesOfCode" | Out-File -FilePath $logFile -Encoding UTF8 -Append

# Versões de pacotes principais
$packageJson = Get-Content "package.json" | ConvertFrom-Json
Write-Host "$Green✓ Dependências configuradas:$Reset"
$packageJson.dependencies.PSObject.Properties | ForEach-Object {
    Write-Host "  - $($_.Name): $($_.Value)"
    "  - $($_.Name): $($_.Value)" | Out-File -FilePath $logFile -Encoding UTF8 -Append
}

Write-Host ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host "$Green" + "=" * 80 + "$Reset"
Write-Host "$Green✅ FASE 3.4 - SETUP CONCLUÍDO COM SUCESSO!$Reset"
Write-Host "$Green" + "=" * 80 + "$Reset"
Write-Host ""

Write-Host "$Yellow📊 RESUMO DA EXECUÇÃO:$Reset"
Write-Host "  ✓ Node.js: OK"
Write-Host "  ✓ npm: OK"
Write-Host "  ✓ Estrutura de arquivos: OK"
Write-Host "  ✓ npm install: OK"
Write-Host "  ✓ node_modules: $moduleCount módulos"
Write-Host "  ✓ Código TypeScript: $linesOfCode linhas"
Write-Host ""

Write-Host "$Yellow🚀 PRÓXIMOS PASSOS:$Reset"
Write-Host "  1. Edite o arquivo .env.local com suas credenciais"
Write-Host "  2. Execute: npm run dev"
Write-Host "  3. Abra no navegador: http://localhost:5173/noticias"
Write-Host ""

Write-Host "$Yellow📝 ARQUIVOS GERADOS:$Reset"
Write-Host "  Log: $logFile"
Write-Host ""

# Salvar resumo final
"" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"RESUMO FINAL:" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Setup concluído com sucesso" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Tempo total: $(Get-Date)" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- npm install: OK" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Módulos: $moduleCount" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Código TypeScript: $linesOfCode linhas" | Out-File -FilePath $logFile -Encoding UTF8 -Append

Write-Host "$Green" + "=" * 80 + "$Reset"
Write-Host "$GreenTudo pronto! Verifique o arquivo $logFile para detalhes completos.$Reset"
Write-Host "$Green" + "=" * 80 + "$Reset"
