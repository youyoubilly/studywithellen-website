#!/usr/bin/env bash
# Verify ops/nginx-ellen.conf contains required security headers (Stage 5 gate).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${ELLEN_NGINX_CONFIG:-$ROOT/ops/nginx-ellen.conf}"

if [[ ! -f "$CONFIG" ]]; then
  echo "ERROR: nginx config not found: $CONFIG" >&2
  exit 1
fi

required=(
  "X-Frame-Options"
  "X-Content-Type-Options"
  "Referrer-Policy"
  "Permissions-Policy"
  "Content-Security-Policy"
  "server_tokens off"
  "listen 8080"
  "server_name hk1.youyoubilly.com"
  "root /var/www/ellen"
)

missing=0
for token in "${required[@]}"; do
  if ! grep -qF "$token" "$CONFIG"; then
    echo "MISSING: $token" >&2
    missing=$((missing + 1))
  fi
done

if [[ "$missing" -gt 0 ]]; then
  echo "nginx security verification failed ($missing missing)" >&2
  exit 1
fi

echo "nginx security headers OK — $CONFIG"
