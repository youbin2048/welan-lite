$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$srcDir = Join-Path $root "src"
$distDir = Join-Path $root "dist"
$firmwareAssetsDir = Join-Path (Split-Path -Parent $root) "firmware\assets"

if (-not (Test-Path $srcDir)) {
  throw "Source directory not found: $srcDir"
}

New-Item -ItemType Directory -Force -Path $distDir | Out-Null
New-Item -ItemType Directory -Force -Path $firmwareAssetsDir | Out-Null

function Read-Utf8([string] $path) {
  [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
}

function Write-Utf8([string] $path, [string] $content) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

function Write-Gzip([string] $sourcePath, [string] $targetPath) {
  $buffer = [System.IO.File]::ReadAllBytes($sourcePath)
  $fileStream = [System.IO.File]::Create($targetPath)
  try {
    $gzipStream = New-Object System.IO.Compression.GzipStream($fileStream, [System.IO.Compression.CompressionLevel]::Optimal)
    try {
      $gzipStream.Write($buffer, 0, $buffer.Length)
    }
    finally {
      $gzipStream.Dispose()
    }
  }
  finally {
    $fileStream.Dispose()
  }
}

function Compress-Html([string] $content) {
  $content = $content -replace ">\s+<", "><"
  $content = $content -replace "\r?\n\s*", ""
  $content.Trim().Replace("./style.css", "./app.css")
}

function Compress-Css([string] $content) {
  $content = [regex]::Replace($content, "/\*[\s\S]*?\*/", "")
  $content = $content -replace "\r?\n", ""
  $content = $content -replace "\s{2,}", " "
  $content = $content -replace "\s*([{}:;,])\s*", '$1'
  $content = $content -replace ";}", "}"
  $content.Trim()
}

function Compress-Js([string] $content) {
  $content.TrimEnd() + "`n"
}

$html = Read-Utf8 (Join-Path $srcDir "index.html")
$css = Read-Utf8 (Join-Path $srcDir "style.css")
$js = Read-Utf8 (Join-Path $srcDir "app.js")

Write-Utf8 (Join-Path $distDir "index.html") (Compress-Html $html)
Write-Utf8 (Join-Path $distDir "app.css") (Compress-Css $css)
Write-Utf8 (Join-Path $distDir "app.js") (Compress-Js $js)

Write-Gzip (Join-Path $distDir "index.html") (Join-Path $firmwareAssetsDir "index.html.gz")
Write-Gzip (Join-Path $distDir "app.css") (Join-Path $firmwareAssetsDir "app.css.gz")
Write-Gzip (Join-Path $distDir "app.js") (Join-Path $firmwareAssetsDir "app.js.gz")

Write-Host "Built UI assets into $distDir"
Write-Host "Exported gzip assets into $firmwareAssetsDir"
