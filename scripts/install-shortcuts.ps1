# Run once: right-click this file in Explorer and pick "Run with PowerShell".
# Adds three shortcuts to your Desktop:
#   "GuestFlow - Dev"     -> starts the dev server
#   "GuestFlow - Build"   -> produces a production build
#   "GuestFlow - Browser" -> opens localhost:5173
#
# You can then right-click any shortcut and "Pin to taskbar" / "Pin to Start".

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$desktop = [Environment]::GetFolderPath("Desktop")

function New-AppShortcut {
  param(
    [string]$ShortcutPath,
    [string]$TargetPath,
    [string]$WorkingDirectory,
    [string]$Description
  )
  $shell = New-Object -ComObject WScript.Shell
  $sc = $shell.CreateShortcut($ShortcutPath)
  $sc.TargetPath = $TargetPath
  $sc.WorkingDirectory = $WorkingDirectory
  $sc.Description = $Description
  $sc.Save()
  Write-Host "  OK $ShortcutPath"
}

Write-Host "Installing GuestFlow shortcuts..." -ForegroundColor Cyan
Write-Host ""

New-AppShortcut `
  -ShortcutPath (Join-Path $desktop "GuestFlow - Dev.lnk") `
  -TargetPath (Join-Path $projectRoot "dev.cmd") `
  -WorkingDirectory $projectRoot `
  -Description "Start the GuestFlow dev server"

New-AppShortcut `
  -ShortcutPath (Join-Path $desktop "GuestFlow - Build.lnk") `
  -TargetPath (Join-Path $projectRoot "build.cmd") `
  -WorkingDirectory $projectRoot `
  -Description "Build the GuestFlow production bundle"

New-AppShortcut `
  -ShortcutPath (Join-Path $desktop "GuestFlow - Browser.lnk") `
  -TargetPath (Join-Path $projectRoot "open-app.cmd") `
  -WorkingDirectory $projectRoot `
  -Description "Open localhost:5173 in your browser"

Write-Host ""
Write-Host "Done. Three shortcuts are now on your Desktop." -ForegroundColor Green
Write-Host "Right-click any one to pin it to the taskbar or Start menu."
