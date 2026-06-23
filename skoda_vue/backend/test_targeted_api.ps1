# Test the new targeted Skoda Fabia API

Write-Host "Testing new targeted /explain endpoint..." -ForegroundColor Green

$testData = @{
    text = "Testing a small apartment room"
    language = "english"
    explanationType = "funny"
    measurement = @{
        type = "length"
        value = 5
        unit = "m"
    }
    model = "gpt-3.5-turbo"
} | ConvertTo-Json -Depth 4

Write-Host "Request data:" -ForegroundColor Yellow
Write-Host $testData

Write-Host "`nSending request..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "https://skoda-fabia-api.kornelko.workers.dev/explain" -Method Post -ContentType "application/json" -Body $testData
    
    Write-Host "`nResponse:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
    
    Write-Host "`nConversion Result:" -ForegroundColor Cyan
    Write-Host "  Input: $($response.conversion.inputValue) $($response.conversion.inputUnit)" -ForegroundColor White
    Write-Host "  Result: $($response.conversion.resultValue) $($response.conversion.resultUnit)" -ForegroundColor White
    Write-Host "  Calculation: $($response.conversion.calculation)" -ForegroundColor White
    
    Write-Host "`nAI Response:" -ForegroundColor Magenta
    Write-Host $response.aiResponse
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}