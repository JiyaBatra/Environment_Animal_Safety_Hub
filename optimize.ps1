# Performance Optimization Script for EcoLife
# Enhanced script with proper minification and monitoring

param(
    [switch]$Minify,
    [switch]$CompressImages,
    [switch]$Monitor,
    [switch]$All,
    [switch]$Clean
)

if ($All) {
    $Minify = $true
    $CompressImages = $true
    $Monitor = $true
}

$frontendPath = "frontend"
$cssPath = "$frontendPath/css"
$jsPath = "$frontendPath/js"
$imagesPath = "$frontendPath/assets/images"

Write-Host "EcoLife Enhanced Performance Optimization Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

function Minify-CSS {
    param([string]$filePath)

    $content = Get-Content $filePath -Raw
    if (-not $content) { $content = Get-Content $filePath | Out-String }

    # Advanced CSS minification
    $minified = $content
    $minified = $minified -replace '/\*[\s\S]*?\*/', ''  # Remove comments
    $minified = $minified -replace '\s+', ' '            # Collapse whitespace
    $minified = $minified -replace '\s*{\s*', '{'        # Remove spaces around braces
    $minified = $minified -replace '\s*}\s*', '}'        # Remove spaces around braces
    $minified = $minified -replace '\s*;\s*', ';'        # Remove spaces around semicolons
    $minified = $minified -replace ';\s*}', '}'          # Remove spaces before closing braces
    $minified = $minified -replace '\s*,\s*', ','        # Remove spaces around commas
    $minified = $minified -replace '\s*:\s*', ':'        # Remove spaces around colons
    $minified = $minified -replace '}\s*', '}'           # Remove trailing spaces after closing braces

    return $minified.Trim()
}

function Minify-JS {
    param([string]$filePath)

    $content = Get-Content $filePath -Raw
    if (-not $content) { $content = Get-Content $filePath | Out-String }

    # Basic JS minification (remove comments and collapse whitespace)
    $minified = $content
    $minified = $minified -replace '/\*[\s\S]*?\*/', ''  # Remove multi-line comments
    $minified = $minified -replace '//.*?$', ''          # Remove single-line comments (basic)
    $minified = $minified -replace '\s+', ' '            # Collapse whitespace
    $minified = $minified -replace '\s*{\s*', '{'        # Remove spaces around braces
    $minified = $minified -replace '\s*}\s*', '}'        # Remove spaces around braces
    $minified = $minified -replace '\s*\(\s*', '('       # Remove spaces around parentheses
    $minified = $minified -replace '\s*\)\s*', ')'       # Remove spaces around parentheses
    $minified = $minified -replace '\s*;\s*', ';'        # Remove spaces around semicolons
    $minified = $minified -replace '\s*,\s*', ','        # Remove spaces around commas
    $minified = $minified -replace '\s*=\s*', '='        # Remove spaces around equals
    $minified = $minified -replace '\s*\+\s*', '+'       # Remove spaces around plus
    $minified = $minified -replace '\s*-\s*', '-'        # Remove spaces around minus

    return $minified.Trim()
}

if ($Minify) {
    Write-Host "Creating minified CSS and JS files..." -ForegroundColor Yellow

    # Minify CSS files and create .min.css versions
    Get-ChildItem -Path $cssPath -Recurse -Filter "*.css" | Where-Object { !$_.Name.EndsWith('.min.css') } | ForEach-Object {
        $filePath = $_.FullName
        $minFilePath = $filePath -replace '\.css$', '.min.css'

        Write-Host "Minifying CSS: $($_.Name) -> $($_.Name -replace '\.css$', '.min.css')" -ForegroundColor Cyan

        try {
            $minified = Minify-CSS -filePath $filePath
            $minified | Out-File -FilePath $minFilePath -Encoding UTF8 -NoNewline

            # Calculate compression ratio
            $originalSize = (Get-Item $filePath).Length
            $minifiedSize = (Get-Item $minFilePath).Length
            $ratio = [math]::Round(($originalSize - $minifiedSize) / $originalSize * 100, 1)
            Write-Host "  Compressed: ${originalSize} -> ${minifiedSize} bytes (${ratio}% reduction)" -ForegroundColor Gray
        } catch {
            Write-Host "  Error minifying $($_.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    # Minify JS files and create .min.js versions
    Get-ChildItem -Path $jsPath -Recurse -Filter "*.js" | Where-Object { !$_.Name.EndsWith('.min.js') } | ForEach-Object {
        $filePath = $_.FullName
        $minFilePath = $filePath -replace '\.js$', '.min.js'

        Write-Host "Minifying JS: $($_.Name) -> $($_.Name -replace '\.js$', '.min.js')" -ForegroundColor Cyan

        try {
            $minified = Minify-JS -filePath $filePath
            $minified | Out-File -FilePath $minFilePath -Encoding UTF8 -NoNewline

            # Calculate compression ratio
            $originalSize = (Get-Item $filePath).Length
            $minifiedSize = (Get-Item $minFilePath).Length
            $ratio = [math]::Round(($originalSize - $minifiedSize) / $originalSize * 100, 1)
            Write-Host "  Compressed: ${originalSize} -> ${minifiedSize} bytes (${ratio}% reduction)" -ForegroundColor Gray
        } catch {
            Write-Host "  Error minifying $($_.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    Write-Host "Minification complete!" -ForegroundColor Green
}

if ($CompressImages) {
    Write-Host "Image compression analysis:" -ForegroundColor Yellow
    Write-Host "Large images found (>500KB):" -ForegroundColor Red

    $largeImages = Get-ChildItem -Path $imagesPath -Recurse -File | Where-Object {
        $_.Extension -in '.png','.jpg','.jpeg' -and $_.Length -gt 512KB
    } | Sort-Object Length -Descending

    $totalSize = 0
    $largeImages | ForEach-Object {
        $sizeKB = [math]::Round($_.Length / 1KB, 1)
        $totalSize += $_.Length
        Write-Host ("  - {0} : {1}KB" -f $_.FullName.Replace((Get-Location).Path + '\', ''), $sizeKB) -ForegroundColor Red
    }

    $totalSizeMB = [math]::Round($totalSize / 1MB, 2)
    Write-Host "`nTotal size of large images: ${totalSizeMB}MB" -ForegroundColor Yellow

    Write-Host "`nRecommended optimizations:" -ForegroundColor Yellow
    Write-Host "1. Use tools like ImageOptim, TinyPNG, or Squoosh for compression" -ForegroundColor White
    Write-Host "2. Convert PNG/JPG to WebP format for better compression" -ForegroundColor White
    Write-Host "3. Use responsive images with srcset for different screen sizes" -ForegroundColor White
    Write-Host "4. Consider lazy loading for below-the-fold images" -ForegroundColor White
    Write-Host "5. Target 50-70% quality reduction for photos, 80-90% for graphics" -ForegroundColor White
}

if ($Monitor) {
    Write-Host "Performance monitoring setup:" -ForegroundColor Yellow

    # Check if performance monitor exists
    $monitorPath = "$jsPath/global/performance-monitor.js"
    if (Test-Path $monitorPath) {
        Write-Host "✅ Performance monitor found at: $monitorPath" -ForegroundColor Green

        # Create minified version
        $minMonitorPath = $monitorPath -replace '\.js$', '.min.js'
        if (!(Test-Path $minMonitorPath)) {
            Write-Host "Creating minified performance monitor..." -ForegroundColor Cyan
            try {
                $minified = Minify-JS -filePath $monitorPath
                $minified | Out-File -FilePath $minMonitorPath -Encoding UTF8 -NoNewline
                Write-Host "✅ Minified performance monitor created" -ForegroundColor Green
            } catch {
                Write-Host "❌ Error creating minified performance monitor: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "✅ Minified performance monitor already exists" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Performance monitor not found at: $monitorPath" -ForegroundColor Red
    }

    # Check service worker
    $swPath = "$frontendPath/sw.js"
    if (Test-Path $swPath) {
        Write-Host "✅ Service worker found at: $swPath" -ForegroundColor Green
    } else {
        Write-Host "❌ Service worker not found at: $swPath" -ForegroundColor Red
    }

    Write-Host "`nPerformance monitoring recommendations:" -ForegroundColor Yellow
    Write-Host "1. Include performance-monitor.min.js in all pages" -ForegroundColor White
    Write-Host "2. Monitor Core Web Vitals in browser DevTools" -ForegroundColor White
    Write-Host "3. Use Lighthouse for comprehensive performance audits" -ForegroundColor White
    Write-Host "4. Set up real user monitoring (RUM) for production" -ForegroundColor White
}

if ($Clean) {
    Write-Host "Cleaning up minified files..." -ForegroundColor Yellow

    $minifiedFiles = Get-ChildItem -Path $frontendPath -Recurse -File | Where-Object {
        $_.Name -match '\.min\.(css|js)$'
    }

    if ($minifiedFiles.Count -gt 0) {
        $minifiedFiles | ForEach-Object {
            Write-Host "Removing: $($_.FullName)" -ForegroundColor Cyan
            Remove-Item $_.FullName -Force
        }
        Write-Host "✅ Cleaned up $($minifiedFiles.Count) minified files" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Optimization script completed!" -ForegroundColor Green
$usageMessage = 'Use -Minify, -CompressImages, -Monitor, -Clean, or -All parameters'
Write-Host $usageMessage -ForegroundColor Gray