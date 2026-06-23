# Test the Skoda Fabia API

Write-Host "Testing /models endpoint..." -ForegroundColor Green
$models = Invoke-RestMethod -Uri "https://skoda-fabia-api.kornelko.workers.dev/models" -Method Get
$models | ConvertTo-Json -Depth 3

Write-Host "`nTesting /explain endpoint..." -ForegroundColor Green
$testData = @{
    text = "Testing our awesome Skoda Fabia converter!"
    length = @{
        value = 5
        unit = "m"
    }
    width = @{
        value = 2
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
    $response | ConvertTo-Json -Depth 5
    
    Write-Host "`nAI Response:" -ForegroundColor Cyan
    Write-Host $response.ai
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}