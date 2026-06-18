@echo off
REM Double-click to start the GuestFlow dev server.
REM Stays open so you can see logs. Ctrl+C to stop.

setlocal
pushd "%~dp0"

title GuestFlow dev

if not exist "node_modules\" (
  echo Installing dependencies for the first time...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Press any key to close.
    pause >nul
    exit /b 1
  )
)

echo.
echo Starting GuestFlow dev server...
echo Open http://localhost:5173 in your browser.
echo Press Ctrl+C to stop.
echo.

call npm run dev

popd
endlocal
