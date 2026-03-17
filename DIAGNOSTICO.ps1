# ============================================================================
# DIAGNÓSTICO - VERIFICAR INSTALAÇÃO DE NODE.JS
# ============================================================================

Write-Host "================================================================================"
Write-Host "DIAGNÓSTICO - Verificando Node.js e npm"
Write-Host "================================================================================"
Write-Host ""

# Teste 1: Verificar se node existe
Write-Host "[1] Procurando por Node.js..."
$nodeExists = $null
try {
    $nodeExists = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeExists) {
        Write-Host "OK - Node.js encontrado!"
        Write-Host "Localização: $($nodeExists.Source)"
        node --version
    } else {
        Write-Host "ERRO - Node.js NAO encontrado no PATH"
    }
} catch {
    Write-Host "ERRO - Node.js NAO encontrado"
}

Write-Host ""

# Teste 2: Verificar npm
Write-Host "[2] Procurando por npm..."
$npmExists = $null
try {
    $npmExists = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmExists) {
        Write-Host "OK - npm encontrado!"
        Write-Host "Localização: $($npmExists.Source)"
        npm --version
    } else {
        Write-Host "ERRO - npm NAO encontrado no PATH"
    }
} catch {
    Write-Host "ERRO - npm NAO encontrado"
}

Write-Host ""
Write-Host "================================================================================"

if (-not $nodeExists) {
    Write-Host "SOLUÇÃO:"
    Write-Host ""
    Write-Host "1. Abra https://nodejs.org"
    Write-Host ""
    Write-Host "2. Baixe a versão LTS (recomendado)"
    Write-Host ""
    Write-Host "3. Execute o instalador"
    Write-Host ""
    Write-Host "4. IMPORTANTE: Marque a opção 'Add to PATH'"
    Write-Host ""
    Write-Host "5. Reinicie o PowerShell"
    Write-Host ""
    Write-Host "6. Execute novamente este diagnóstico"
    Write-Host ""
} else {
    Write-Host "OK - Tudo está instalado corretamente!"
    Write-Host ""
    Write-Host "Agora execute:"
    Write-Host "powershell -ExecutionPolicy Bypass -File EXECUTE_FASE_3.4_CORRIGIDO.ps1"
    Write-Host ""
}

Write-Host "================================================================================"
