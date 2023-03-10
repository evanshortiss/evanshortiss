echo "$(date -u): EmulationStation log upload cron job starting..."

podman run --rm \
-v "$HOME/.emulationstation/:/var/lib/.emulationstation" \
-v "$HOME/.aws/credentials:/home/node/.aws/credentials" \
quay.io/evanshortiss/emulation-station-logs-to-s3:latest

echo "$(date -u): EmulationStation log upload cron job finished..."