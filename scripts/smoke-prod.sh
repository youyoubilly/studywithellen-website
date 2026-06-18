#!/usr/bin/env bash
# Post-deploy smoke checks for Ellen site on HK1 (Stage 6+).
set -euo pipefail

URL="${ELLEN_SMOKE_URL:-http://hk1.youyoubilly.com:8080}"
EN_URL="${URL%/}/en/"

check_page() {
  local page_url="$1"
  local headline_pattern="$2"

  echo "==> HTTP smoke: $page_url ..."
  headers="$(curl -fsSI "$page_url")"
  echo "$headers" | head -5

  echo "$headers" | grep -qi '^HTTP/.* 200' || {
    echo "FAIL: expected HTTP 200 for $page_url" >&2
    exit 1
  }

  for header in \
    "x-frame-options:" \
    "x-content-type-options:" \
    "referrer-policy:" \
    "permissions-policy:" \
    "content-security-policy:"; do
    echo "$headers" | grep -qi "$header" || {
      echo "FAIL: missing $header on $page_url" >&2
      exit 1
    }
  done

  body="$(curl -fsS "$page_url")"
  echo "$body" | grep -q "Ellen Wang English Studio" || {
    echo "FAIL: page body missing studio name on $page_url" >&2
    exit 1
  }
  echo "$body" | grep -q "$headline_pattern" || {
    echo "FAIL: page body missing expected headline on $page_url" >&2
    exit 1
  }
}

echo "==> DNS check ..."
resolved="$(dig +short hk1.youyoubilly.com A | tail -1)"
if [[ "$resolved" != "43.240.13.141" ]]; then
  echo "WARN: hk1.youyoubilly.com -> $resolved (expected 43.240.13.141)" >&2
else
  echo "DNS OK: $resolved"
fi

check_page "$URL" "雅思口语"
check_page "$EN_URL" "IELTS Speaking"

echo "==> Smoke checks passed — $URL and $EN_URL"
