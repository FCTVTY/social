VERSION=$(grep -m 1 -o '"version": *"[^"]*"' ./package.json | awk -F'"' '{print $4}')
DATE=$(date +%Y%m%d) # Format: YYYYMMDDHHMMSS
APP_VERSION="$VERSION-$DATE"
echo $APP_VERSION