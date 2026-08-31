#!/bin/bash
# Run a locally built image with an env file (no baked-in production URLs).

set -euo pipefail

CONTAINER_NAME="${CONTAINER_NAME:-filix-merchant}"
IMAGE_NAME="${IMAGE_NAME:-filix-merchant:local}"
ENV_FILE="${ENV_FILE:-.env.local}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file: $ENV_FILE"
  echo "Copy .env.example to $ENV_FILE and fill in values."
  exit 1
fi

docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file "${ENV_FILE}" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e HOSTNAME=0.0.0.0 \
  "${IMAGE_NAME}"

docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker logs -f "${CONTAINER_NAME}" --tail 30
