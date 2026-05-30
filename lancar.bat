@echo off
echo ===================================================
echo   MY LIBRAS - Servidor Local
echo ===================================================
echo.
echo Abrindo o navegador em http://localhost:8000 ...
start "" "http://localhost:8000"
echo.
echo Tentando iniciar o servidor com 'python'...
python -m http.server 8000
if %ERRORLEVEL% neq 0 (
    echo.
    echo Tentativa com 'python' falhou. Tentando com 'py'...
    py -m http.server 8000
)
if %ERRORLEVEL% neq 0 (
    echo.
    echo ===================================================
    echo ERRO: Nao foi possivel iniciar o servidor Python.
    echo Certifique-se de que o Python esta instalado no seu PATH.
    echo ===================================================
    pause
)
