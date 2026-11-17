<#
  preview.ps1 — view the site locally before pushing.
  Opens http://localhost:5600 and serves this folder. Ctrl+C to stop.
#>

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$port = 5600
Write-Host "Serving $PSScriptRoot" -ForegroundColor Cyan
Write-Host "Open: http://localhost:$port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray

Start-Process "http://localhost:$port"

try {
    python -m http.server $port
}
catch {
    npx --yes serve -l $port .
}
