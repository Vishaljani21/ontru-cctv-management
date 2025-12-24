# Start Local Development Environment
# Ontru CCTV Management

# Stop any running instances first
Write-Host "Stopping any existing Supabase instances..." -ForegroundColor Yellow
npx supabase stop --no-backup

# Start Supabase
Write-Host "Starting Supabase on new ports (5532x)..." -ForegroundColor Cyan
$statusInput = npx supabase start 2>&1

if ($statusInput -match "Is it running?" -or $statusInput -match "not running") {
    Write-Host "Supabase output:" 
    Write-Host $statusInput
}

# Parse Keys
$apiUrl = $statusInput | Select-String "API URL: (.*)" | ForEach-Object { $_.Matches.Groups[1].Value.Trim() }
$anonKey = $statusInput | Select-String "anon key: (.*)" | ForEach-Object { $_.Matches.Groups[1].Value.Trim() }

if (-not $apiUrl) {
    # Fallback: Assume the port change worked and construct it manually if not found (e.g. if output is noisy)
    $apiUrl = "http://127.0.0.1:55321"
    Write-Host "Could not parse API URL, using default for new config: $apiUrl" -ForegroundColor Yellow
}

if ($anonKey) {
    Write-Host "Found Supabase credentials!" -ForegroundColor Green
    Write-Host "API URL: $apiUrl" -ForegroundColor Gray
    
    $env:VITE_SUPABASE_URL = $apiUrl
    $env:VITE_SUPABASE_ANON_KEY = $anonKey
    
    Write-Host "Starting Vite Server..." -ForegroundColor Green
    # Force loading of env vars if needed, but we set them above for this session
    npm run dev
}
else {
    Write-Host "Could not automatically retrieve Supabase Anon Key." -ForegroundColor Red
    Write-Host "Please check 'npx supabase status' output."
    Write-Host $statusInput
}
