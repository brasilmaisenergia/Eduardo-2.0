@echo off
REM ============================================================================
REM SCRIPT FASE 3.4 - SETUP AUTOMÁTICO
REM Eduardo 2.0 - Sistema de Análise de Notícias
REM ============================================================================

setlocal enabledelayedexpansion

REM Configurar cor
cls
color 0A

echo.
echo ================================================================================
echo.
echo     █ INICIANDO FASE 3.4 - SETUP AUTOMÁTICO
echo.
echo ================================================================================
echo.

REM Criar log
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set logfile=setup_log_%mydate%_%mytime%.txt

echo FASE 3.4 - SETUP LOG > %logfile%
echo Data: %date% %time% >> %logfile%
echo Computador: %COMPUTERNAME% >> %logfile%
echo Usuário: %USERNAME% >> %logfile%
echo. >> %logfile%

REM ============================================================================
REM [1] VALIDAR PRÉ-REQUISITOS
REM ============================================================================
echo [1/4] Validando pré-requisitos...
echo. >> %logfile%
echo --- PRE-REQUISITOS --- >> %logfile%

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    color 0C
    echo ERRO: Node.js não encontrado!
    echo Instale em: https://nodejs.org
    color 0A
    echo. >> %logfile%
    echo ERRO: Node.js não encontrado >> %logfile%
    goto error
)

for /f "tokens=*" %%i in ('node --version') do set nodeversion=%%i
echo OK - Node.js: %nodeversion%
echo Node.js: %nodeversion% >> %logfile%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: npm não encontrado!
    echo ERRO: npm não encontrado >> %logfile%
    goto error
)

for /f "tokens=*" %%i in ('npm --version') do set npmversion=%%i
echo OK - npm: %npmversion%
echo npm: %npmversion% >> %logfile%

echo.

REM ============================================================================
REM [2] VERIFICAR ESTRUTURA
REM ============================================================================
echo [2/4] Verificando estrutura de arquivos...
echo. >> %logfile%
echo --- ESTRUTURA --- >> %logfile%

set missingfiles=0
for %%f in (package.json tsconfig.json vite.config.ts .env.local index.html) do (
    if exist %%f (
        echo OK - %%f
        echo %%f - OK >> %logfile%
    ) else (
        echo FALTA - %%f
        echo %%f - FALTANDO >> %logfile%
        set /a missingfiles=!missingfiles!+1
    )
)

if %missingfiles% GTR 0 (
    color 0C
    echo.
    echo ERRO: Faltam %missingfiles% arquivos essenciais!
    color 0A
    goto error
)

echo.

REM ============================================================================
REM [3] INSTALAR DEPENDÊNCIAS
REM ============================================================================
echo [3/4] Instalando dependências npm...
echo (Isso pode levar 2-3 minutos)
echo. >> %logfile%
echo --- NPM INSTALL --- >> %logfile%

npm install >> %logfile% 2>&1

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ERRO: npm install falhou!
    color 0A
    echo npm install falhou >> %logfile%
    goto error
)

color 0A
echo OK - Dependências instaladas
echo npm install - OK >> %logfile%
echo.

REM ============================================================================
REM [4] VALIDAR INSTALAÇÃO
REM ============================================================================
echo [4/4] Validando instalação...
echo. >> %logfile%
echo --- VALIDACAO POS-INSTALL --- >> %logfile%

if exist node_modules (
    echo OK - node_modules encontrado
    echo node_modules - OK >> %logfile%
) else (
    color 0C
    echo ERRO: node_modules não encontrado!
    color 0A
    echo node_modules não encontrado >> %logfile%
    goto error
)

echo.
echo.

REM ============================================================================
REM SUCESSO
REM ============================================================================
color 0A
echo ================================================================================
echo.
echo     OK! FASE 3.4 - SETUP CONCLUÍDO COM SUCESSO!
echo.
echo ================================================================================
echo.

echo RESUMO:
echo   ✓ Node.js: %nodeversion%
echo   ✓ npm: %npmversion%
echo   ✓ Estrutura: OK
echo   ✓ npm install: OK
echo   ✓ node_modules: Instalado
echo.

echo PRÓXIMOS PASSOS:
echo   1. Edite .env.local com suas credenciais
echo   2. Execute: npm run dev
echo   3. Abra: http://localhost:5173/noticias
echo.

echo LOG SALVO EM: %logfile%
echo.

echo ================================================================================
pause
exit /b 0

:error
color 0C
echo.
echo ERRO DURANTE O SETUP!
echo Verifique o arquivo %logfile% para detalhes.
echo.
pause
exit /b 1
