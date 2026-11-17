<#
  deploy.ps1 — publish Gazitime with one command.

  Usage:
    cd "E:\Programmng Space\Gazitime"
    .\deploy.ps1                       # auto commit message
    .\deploy.ps1 "added sports story"  # custom commit message

  If PowerShell blocks the script, run once:
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#>

param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not (Test-Path ".git")) {
    Write-Host "Not a git repository here. Run: git init" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = "update site - " + (Get-Date -Format "yyyy-MM-dd HH:mm")
}

git add -A

$pending = git status --porcelain
if ([string]::IsNullOrWhiteSpace($pending)) {
    Write-Host "Nothing to deploy - no changes since the last push." -ForegroundColor Yellow
    exit 0
}

git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit failed. Fix the error above and try again." -ForegroundColor Red
    exit 1
}

git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. Check your internet / GitHub login (gh auth status)." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pushed. Cloudflare Pages rebuilds in about 30-60 seconds." -ForegroundColor Green
Write-Host "Live: https://gazitime.online" -ForegroundColor Cyan
