@echo off
REM Double-click to build the production bundle.
REM Output lands in dist\.

setlocal
pushd "%~dp0"

title GuestFlow build

if not exist "node_modules\" (
  echo Installing dependencies for the first time...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Press any key to close.
    pause >nul
    exit /b 1
  )
)

echo.
echo Building production bundle...
echo.

call npm run build

if errorlevel 1 (
  echo.
  echo Build failed. Press any key to close.
  pause >nul
  exit /b 1
)

echo.
echo Done. Output is in dist\.
echo Press any key to close.
pause >nul

popd
endlocal
