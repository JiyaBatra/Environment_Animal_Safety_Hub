# Performance Optimization Script for EcoLife
# This script minifies CSS and JS files IN PLACE

param(
    [switch]$Minify,
    [switch]$CompressImages,
    [switch]$All
)

if ($All) {
    $Minify = $true
    $CompressImages = $true
}

$frontendPath = "frontend"
$cssPath = "$frontendPath/css"
$jsPath = "$frontendPath/js"
$imagesPath = "$frontendPath/assets/images"

Write-Host "EcoLife Performance Optimization Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

if ($Minify) {
    Write-Host "Minifying CSS files IN PLACE..." -ForegroundColor Yellow

    # Minify CSS files (in place)
    Get-ChildItem -Path $cssPath -Recurse -Filter "*.css" | ForEach-Object {
        $filePath = $_.FullName
        Write-Host "Minifying: $($_.Name)" -ForegroundColor Cyan

        # Simple CSS minification (remove comments, extra whitespace)
        $content = Get-Content $filePath -Raw
        $minified = $content -replace '/\*[\s\S]*?\*/', '' -replace '\s+', ' ' -replace '\s*{\s*', '{' -replace '\s*}\s*', '}' -replace '\s*;\s*', ';' -replace ';\s*}', '}' -replace '\s*,\s*', ','

        # Overwrite the original file
        $minified | Out-File -FilePath $filePath -Encoding UTF8 -NoNewline
    }

    Write-Host "CSS minification complete! JavaScript minification skipped to preserve syntax." -ForegroundColor Green
}

if ($CompressImages) {
    Write-Host "Image compression recommendations:" -ForegroundColor Yellow
    Write-Host "Large images found (>1MB):" -ForegroundColor Red

    Get-ChildItem -Path $imagesPath -Recurse -File | Where-Object { $_.Extension -in '.png','.jpg','.jpeg' -and $_.Length -gt 1MB } | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  - $($_.FullName.Replace($imagesPath, '')) : ${sizeMB}MB" -ForegroundColor Red
    }

    Write-Host "`nRecommended actions:" -ForegroundColor Yellow
    Write-Host "1. Use tools like ImageOptim, TinyPNG, or Squoosh to compress images" -ForegroundColor White
    Write-Host "2. Convert PNG/JPG to WebP format for better compression" -ForegroundColor White
    Write-Host "3. Use responsive images with srcset for different screen sizes" -ForegroundColor White
    Write-Host "4. Consider lazy loading for below-the-fold images" -ForegroundColor White
}

Write-Host "`nOptimization script completed!" -ForegroundColor Green