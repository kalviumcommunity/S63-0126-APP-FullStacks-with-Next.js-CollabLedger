@echo off
setlocal enabledelayedexpansion

REM Kill common local dev ports (adjust as needed)
for %%p in (
  3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010
  4000 4200
  5000 5001
  5173 4173
  8000 8001
  8080 8081
  8888
  9000
  9229
) do (
  for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%p" ^| findstr LISTENING') do (
    echo Killing PID %%a on port %%p
    taskkill /PID %%a /F >nul 2>nul
  )
)

echo Done.

