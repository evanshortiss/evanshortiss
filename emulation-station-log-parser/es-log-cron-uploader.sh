echo "$(date -u): EmulationStation log upload cron job starting..."

docker run --rm \
-v "/home/pi/.emulationstation/:/var/lib/.emulationstation" \
-v "/home/pi/.aws/credentials:/home/node/.aws/credentials" \
evanshortiss/emulation-station-logs-to-s3:latest

echo "$(date -u): EmulationStation log upload cron job finished..."