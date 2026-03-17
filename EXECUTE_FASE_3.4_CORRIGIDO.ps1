# ============================================================================
# SCRIPT FASE 3.4 - SETUP AUTOMÁTICO (VERSÃO CORRIGIDA)
# ============================================================================

Write-Host "================================================================================"
Write-Host "INICIANDO FASE 3.4 - SETUP AUTOMÁTICO"
Write-Host "================================================================================"
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "setup_log_$timestamp.txt"

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
Write-Host "[1/5] Validando pré-requisitos..."

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "OK - Node.js: $nodeVersion"
    "Node.js: $nodeVersion" | Out-File -FilePath $logFile -Encoding UTF8 -Append
} catch {
    Write-Host "ERRO: Node.js não encontrado!"
    "ERRO: Node.js não encontrado" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "OK - npm: $npmVersion"
    "npm: $npmVersion" | Out-File -FilePath $logFile -Encoding UTF8 -Append
} catch {
    Write-Host "ERRO: npm não encontrado!"
    "ERRO: npm não encontrado" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

Write-Host ""

# ============================================================================
# [2] VERIFICAR PASTA
# ============================================================================
Write-Host "[2/5] Verificando estrutura de arquivos..."

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
        Write-Host "  OK - $file"
        "ARQUIVO: $file - OK" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    } else {
        Write-Host "  FALTA - $file"
        "ARQUIVO: $file - FALTANDO" | Out-File -FilePath $logFile -Encoding UTF8 -Append
        $missingFiles++
    }
}

if ($missingFiles -gt 0) {
    Write-Host "ERRO: Faltam $missingFiles arquivos!"
    exit 1
}

Write-Host "OK - Estrutura validada"
Write-Host ""

# ============================================================================
# [3] INSTALAR DEPENDÊNCIAS
# ============================================================================
Write-Host "[3/5] Instalando dependências npm..."
Write-Host "(Isso pode levar 2-3 minutos)"

$npmInstallOutput = npm install 2>&1
$npmInstallOutput | Out-File -FilePath $logFile -Encoding UTF8 -Append

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: npm install falhou!"
    "ERRO: npm install falhou" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

Write-Host "OK - Instalação concluída"
Write-Host ""

# ============================================================================
# [4] VALIDAÇÃO PÓS-INSTALL
# ============================================================================
Write-Host "[4/5] Validando node_modules..."

if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory | Measure-Object).Count
    Write-Host "OK - $moduleCount módulos instalados"
    "$moduleCount módulos instalados" | Out-File -FilePath $logFile -Encoding UTF8 -Append
} else {
    Write-Host "ERRO: node_modules não encontrado!"
    "ERRO: npm install falhou" | Out-File -FilePath $logFile -Encoding UTF8 -Append
    exit 1
}

Write-Host ""

# ============================================================================
# [5] INFORMAÇÕES DO PROJETO
# ============================================================================
Write-Host "[5/5] Coletando informações do projeto..."

# Contar arquivos TypeScript
$tsFiles = (Get-ChildItem "src" -Filter "*.ts*" -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host "OK - Arquivos TypeScript: $tsFiles"
"Arquivos TypeScript: $tsFiles" | Out-File -FilePath $logFile -Encoding UTF8 -Append

# Contar linhas de código
$linesOfCode = 0
Get-ChildItem "src" -Filter "*.ts*" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $linesOfCode += @(Get-Content $_.FullName | Measure-Object -Line).Lines
}
Write-Host "OK - Linhas de código: $linesOfCode"
"Linhas de código: $linesOfCode" | Out-File -FilePath $logFile -Encoding UTF8 -Append

Write-Host ""

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host "================================================================================"
Write-Host "OK! FASE 3.4 - SETUP CONCLUÍDO COM SUCESSO!"
Write-Host "================================================================================"
Write-Host ""

Write-Host "RESUMO DA EXECUÇÃO:"
Write-Host "  OK - Node.js validado"
Write-Host "  OK - npm validado"
Write-Host "  OK - Estrutura de arquivos"
Write-Host "  OK - npm install completado"
Write-Host "  OK - node_modules: $moduleCount módulos"
Write-Host "  OK - Código TypeScript: $linesOfCode linhas"
Write-Host ""

Write-Host "PROXIMOS PASSOS:"
Write-Host "  1. Edite .env.local com suas credenciais"
Write-Host "  2. Execute: npm run dev"
Write-Host "  3. Abra no navegador: http://localhost:5173/noticias"
Write-Host ""

Write-Host "ARQUIVO DE LOG:"
Write-Host "  $logFile"
Write-Host ""

# Salvar resumo final
"" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"RESUMO FINAL:" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Setup concluído com sucesso" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Tempo: $(Get-Date)" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- npm install: OK" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Módulos: $moduleCount" | Out-File -FilePath $logFile -Encoding UTF8 -Append
"- Código TypeScript: $linesOfCode linhas" | Out-File -FilePath $logFile -Encoding UTF8 -Append

Write-Host "================================================================================"
Write-Host "Tudo pronto! Verifique o arquivo $logFile para detalhes completos."
Write-Host "================================================================================"
Write-Host ""
Write-Host "Agora execute: npm run dev"
Write-Host ""
