# Test the enhanced Skoda Fabia API with area support

Write-Host "Testing enhanced /explain endpoint with area conversion..." -ForegroundColor Green

$testData = @{
    text = "Converting a football field and basketball court to Skoda Fabia units!"
    length = @{
        value = 100
        unit = "m"
    }
    width = @{
        value = 64
        unit = "m"
    }
    area = @{
        value = 6400
        unit = "m2"
    }
    height = @{
        value = 3
        unit = "m"
    }
    model = "gpt-3.5-turbo"
} | ConvertTo-Json -Depth 3

Write-Host "Request data:" -ForegroundColor Yellow
Write-Host $testData

Write-Host "`nSending request..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "https://skoda-fabia-api.kornelko.workers.dev/explain" -Method Post -ContentType "application/json" -Body $testData
    
    Write-Host "`nResponse:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
    Write-Host "`nConversion Details:" -ForegroundColor Cyan
    foreach ($detail in $response.conversionDetails) {
        Write-Host "  • $detail" -ForegroundColor White
    }
    
    Write-Host "`nSkoda Fabia Reference:" -ForegroundColor Cyan
    $response.skodafabiaReference | Format-Table -AutoSize
    
    Write-Host "`nAI Response:" -ForegroundColor Magenta
    Write-Host $response.ai
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}