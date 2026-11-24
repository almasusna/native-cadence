#!/usr/bin/env bash
# Redeploy the native-cadence container: stop & remove the current one,
# rebuild the image from the current source, and start a fresh container.
#
# Usage: ./redeploy.sh            (run after `git pull`)
#        ./redeploy.sh --no-cache (rebuild without Docker layer cache)
set -euo pipefail

cd "$(dirname "$0")"

SERVICE="native-cadence"
BUILD_ARGS=()
[[ "${1:-}" == "--no-cache" ]] && BUILD_ARGS+=(--no-cache)

if [[ ! -f .env ]]; then
  echo "error: .env not found (copy .env.example and fill it in)" >&2
  exit 1
fi

echo "==> Building new image (current container keeps running meanwhile)"
docker compose build "${BUILD_ARGS[@]}" "$SERVICE"

echo "==> Stopping and removing current container"
docker compose stop "$SERVICE" || true
docker compose rm -f "$SERVICE" || true
# Also catch a container with the same name created outside compose
docker rm -f "$SERVICE" >/dev/null 2>&1 || true

echo "==> Starting new container"
docker compose up -d "$SERVICE"

echo "==> Removing dangling images"
docker image prune -f >/dev/null

echo "==> Waiting for app to respond on 127.0.0.1:3000"
for i in {1..30}; do
  if curl -fsS -o /dev/null http://127.0.0.1:3000 2>/dev/null; then
    echo "==> Redeploy complete: app is up"
    docker compose ps "$SERVICE"
    exit 0
  fi
  sleep 1
done

echo "error: app did not respond within 30s. Recent logs:" >&2
docker compose logs --tail=50 "$SERVICE" >&2
exit 1
