# Test the multilingual Skoda Fabia API

Write-Host "Testing multilingual /explain endpoint..." -ForegroundColor Green

$testData = @{
    text = "Testing multilingual explanations for a small room"
    length = @{
        value = 5
        unit = "m"
    }
    width = @{
        value = 3
        unit = "m"
    }
    area = @{
        value = 15
        unit = "m2"
    }
    model = "gpt-3.5-turbo"
} | ConvertTo-Json -Depth 3

Write-Host "Request data:" -ForegroundColor Yellow
Write-Host $testData

Write-Host "`nSending request for multilingual response..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "https://skoda-fabia-api.kornelko.workers.dev/explain" -Method Post -ContentType "application/json" -Body $testData
    
    Write-Host "`nConversion Results:" -ForegroundColor Cyan
    foreach ($detail in $response.conversionDetails) {
        Write-Host "  • $detail" -ForegroundColor White
    }
    
    Write-Host "`nMultilingual AI Response:" -ForegroundColor Magenta
    Write-Host $response.ai
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}