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
docker run --rm \
-v "/home/pi/.emulationstation/:/var/lib/.emulationstation" \
-v "/home/pi/.aws/credentials/:/home/node/.aws/credentials" \
quay.io/evanshortiss/emulation-station-logs-to-s3
```

### Cron Configuration

1. Copy the *emulation-station-log-parser/es-log-cron-uploader.sh* to your Pi.
1. Edit the *es-log-cron-uploader.sh* if necessary, to point to your AWS credentials location.
1. Clone

For example:

```bash
# Assuming you've already copied the file to a local directory
vi es-log-cron-uploader.sh

# Copy it to /usr/local/bin
sudo es-log-cron-uploader.sh /usr/local/bin/es-log-cron-uploader
```

Next, edit add the following cron to your Pi (sudo crontab -e):

```
# Run the emulation station upload cron at 5AM daily
05 0 * * * /usr/local/bin/es-log-cron-uploader
```

If the container image throws strange errors about "unreachable code" or
similar, then you need to update `libseccomp2` or add
`--security-opt seccomp:unconfined` to the `docker run` command.