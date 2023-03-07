# Emulation Station Log Parser and S3 Upload

Reads EmulationStation logs (default location is `~/.emulationstation/es_log.txt`),
parses the logs for games being launched, and records them into a JSON file in
an AWS S3 Bucket.

The stored JSON is a Object that has keys representing game system and title.
The value for each key contains the last time that the game was launched as a
date in ISO format.

Here's a sample:

```json
{
  "[psx] Tenchu - Stealth Assassins": "2023-02-18T23:31:31.000Z",
  "[psx] Tomb Raider": "2023-02-18T23:38:05.000Z",
  "[psx] Metal Gear Solid": "2023-02-24T05:43:57.000Z",
  "[segacd] Snatcher": "2023-03-04T20:41:47.000Z",
  "[megadrive] Sonic The Hedgehog 2.md": "2023-02-23T05:04:20.000Z",
  "[psx] Tekken 3": "2023-02-20T01:34:56.000Z",
}
```

## Usage

### AWS Setup

These are general guidelines, since you might have a preferred IAM/S3
configuration of your own. Basically, you'll need an AWS Access Key and AWS
Secret Access Key that have permission to read/write a single file in an S3
Bucket.

1. Sign into your AWS Account.
1. Create an S3 Bucket. By default, this program assumes you'll name it `emulation-station-records`.
1. Create an IAM user with a Policy that has read/write permissions to the S3 Bucket you created.
1. Create an Access Key for the IAM user you created, and securely store the
credentials!

### Podman/Docker



```bash
podman run --rm \
-v "$HOME/.emulationstation/:/var/lib/.emulationstation" \
-v "$HOME/.aws/credentials/:/home/node/.aws/credentials" \
quay.io/evanshortiss/emulation-station-logs-to-s3
```