#!/usr/bin/env bash
# Stage 7+ delivery verification — run after deploy or before handoff.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="$ROOT/site"
PROD_URL="${ELLEN_SMOKE_URL:-http://hk1.youyoubilly.com:8080}"
EN_URL="${PROD_URL%/}/en/"

run_lighthouse() {
  local url="$1"
  local label="$2"
  local out="/tmp/ellen-delivery-lh-${label}.json"

  echo "==> Production Lighthouse ($label): $url ..."
  npx lighthouse "$url" \
    --only-categories=performance,accessibility,best-practices,seo \
    --form-factor=mobile \
    --quiet \
    --chrome-flags='--headless' \
    --output=json \
    --output-path="$out"

  node -e "
const r=require('$out');
const t={performance:90,accessibility:95,'best-practices':95,seo:90};
let fail=0;
console.log('--- $label ---');
for (const [k,v] of Object.entries(r.categories)) {
  const score=Math.round(v.score*100);
  const ok=score>=(t[k]??0);
  console.log((ok?'OK':'WARN')+':',k,score);
  if(!ok) fail++;
}
if(Math.round(r.categories['best-practices'].score*100)<95){
  console.log('Note: best-practices may be below 95 on HTTP-only sites (HTTPS audit).');
}
process.exit(fail>0?1:0);
"
}

echo "==> Local QA gate ..."
cd "$SITE_DIR"
npm run qa

echo "==> Production smoke ..."
bash "$ROOT/scripts/smoke-prod.sh"

echo "==> Production E2E (all viewports) ..."
BASE_URL="$PROD_URL" npx playwright test

run_lighthouse "$PROD_URL" "zh"
run_lighthouse "$EN_URL" "en"

echo "==> Delivery verification complete — $PROD_URL and $EN_URL"
