#!/bin/bash
# Pull the public GHCR image and restart the container (no local docker build).
#
# Runtime config: .env.prod or .env.local (see .env.example)
# See docs/ops/deploy-ci.md

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

resolve_runtime_env_file() {
	if [[ -n "${RUNTIME_ENV_FILE:-}" ]]; then
		printf '%s\n' "$RUNTIME_ENV_FILE"
		return 0
	fi
	if [[ -f "${REPO_ROOT}/.env.prod" ]]; then
		printf '%s\n' "${REPO_ROOT}/.env.prod"
		return 0
	fi
	if [[ -f "${REPO_ROOT}/.env.local" ]]; then
		printf '%s\n' "${REPO_ROOT}/.env.local"
		return 0
	fi
	printf '%s\n' ""
}

RUNTIME_ENV_FILE="$(resolve_runtime_env_file)"

IMAGE="${MERCHANT_IMAGE:-ghcr.io/filixpay/filix-merchant:latest}"
CONTAINER_NAME="${MERCHANT_CONTAINER:-filix-merchant}"
PORT_HOST="${PORT_HOST:-3000}"
PORT_CONTAINER="${PORT_CONTAINER:-3000}"

if [[ -z "$RUNTIME_ENV_FILE" || ! -f "$RUNTIME_ENV_FILE" ]]; then
	echo "Missing runtime env file (.env.prod or .env.local)."
	echo "Copy .env.example to .env.prod and fill in your values."
	exit 1
fi

echo "Pulling public image $IMAGE ..."
docker pull "$IMAGE"

pulled_image_id=$(docker image inspect -f '{{.Id}}' "$IMAGE")

running_image_id=""
container_running=false
if docker inspect "$CONTAINER_NAME" &>/dev/null; then
	running_image_id=$(docker inspect -f '{{.Image}}' "$CONTAINER_NAME")
	container_running=$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME")
fi

if [[ "$container_running" == "true" && -n "$running_image_id" && "$running_image_id" == "$pulled_image_id" ]]; then
	short_id="${pulled_image_id#sha256:}"
	short_id="${short_id:0:12}"
	echo "Image unchanged (${short_id}); skipping restart."
	exit 0
fi

echo "Restarting container with pulled image..."
docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

docker run -d \
	--name "${CONTAINER_NAME}" \
	--restart unless-stopped \
	-p "${PORT_HOST}:${PORT_CONTAINER}" \
	--env-file "${RUNTIME_ENV_FILE}" \
	-e NODE_ENV=production \
	-e PORT="${PORT_CONTAINER}" \
	-e HOSTNAME=0.0.0.0 \
	"${IMAGE}"

echo "Pruning dangling images..."
docker image prune -f

echo "Deploy complete."
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
