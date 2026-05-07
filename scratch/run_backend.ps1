
$process = Start-Process dotnet -ArgumentList "run", "--urls", "http://localhost:5000" -NoNewWindow -PassThru
Start-Sleep -Seconds 10
if ($process.HasExited) {
    Write-Host "Backend failed to start"
    exit 1
}
Write-Host "Backend started with PID $($process.Id)"
