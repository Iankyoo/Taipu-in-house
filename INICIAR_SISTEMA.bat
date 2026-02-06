@echo off
title SERVIDOR PIZZARIA - NAO FECHE ESSA JANELA
echo Iniciando o sistema da Pizzaria...
echo.

:: 1. Entra na pasta onde este arquivo está salvo
cd /d "%~dp0"

:: 2. Abre o navegador automaticamente
start http://localhost:3000

:: 3. Inicia o servidor Node.js
echo Servidor rodando! Pode usar o navegador.
node src/server.js

pause
