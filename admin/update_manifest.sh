#!/bin/bash

# Read the current version from manifest.json
current_version=$(jq -r '.version' public/manifest.json)

# Increment the version (assuming it follows semantic versioning)
new_version=$(semver -i patch $current_version)

# Update the version in manifest.json
jq --arg version $new_version '.version = $version' public/manifest.json > tmp && mv tmp public/manifest.json

# Output the new version
echo $new_version


current_version=$(jq -r '.version' public/manifest.json)

# Replace the version placeholder in index.html
sed -i "s/%SERVICE_WORKER_VERSION%/$current_version/g" public/index.html