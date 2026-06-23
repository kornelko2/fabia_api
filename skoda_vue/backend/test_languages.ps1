# Test different languages and explanation types

Write-Host "Testing Czech scientific explanation..." -ForegroundColor Green

$testData = @{
    text = "Testing area conversion for parking lot"
    language = "czech"
    explanationType = "scientific"
    measurement = @{
        type = "area"
        value = 100
        unit = "m2"
    }
    model = "gpt-3.5-turbo"
} | ConvertTo-Json -Depth 4

try {
    $response = Invoke-RestMethod -Uri "https://skoda-fabia-api.kornelko.workers.dev/explain" -Method Post -ContentType "application/json" -Body $testData
    
    Write-Host "`nCzech Scientific Response:" -ForegroundColor Cyan
    Write-Host $response.aiResponse
    Write-Host "`nProcessing Time: $($response.processingTimeMs)ms" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "="*50

Write-Host "Testing German funny explanation..." -ForegroundColor Green

$testData2 = @{
    text = "Converting my garden size"
    language = "german"
    explanationType = "funny"
    measurement = @{
        type = "weight"
        value = 500
        unit = "kg"
    }
    model = "gpt-3.5-turbo"
} | ConvertTo-Json -Depth 4

try {
    $response2 = Invoke-RestMethod -Uri "https://skoda-fabia-api.kornelko.workers.dev/explain" -Method Post -ContentType "application/json" -Body $testData2
    
    Write-Host "`nGerman Funny Response:" -ForegroundColor Magenta
    Write-Host $response2.aiResponse
    Write-Host "`nProcessing Time: $($response2.processingTimeMs)ms" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}