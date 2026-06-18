#!/usr/bin/env bash
# One-time HK1 provisioning for Ellen Wang English Studio (Stage 6).
# Installs nginx + fail2ban, opens UFW 8080, deploys vhost config.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${ELLEN_DEPLOY_HOST:-hk1}"
REMOTE_DIR="${ELLEN_REMOTE_DIR:-/var/www/ellen}"
NGINX_SITE="${ELLEN_NGINX_SITE:-ellen}"

echo "==> Pre-flight log cleanup on $REMOTE ..."
ssh "$REMOTE" 'sudo truncate -s 0 /var/log/btmp && sudo journalctl --vacuum-size=500M'

echo "==> Installing nginx + fail2ban on $REMOTE ..."
ssh "$REMOTE" 'sudo apt-get update -qq && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx fail2ban rsync'

echo "==> Configuring fail2ban (sshd jail) ..."
ssh "$REMOTE" 'sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[sshd]
enabled = true
maxretry = 3
findtime = 600
bantime = 3600
EOF
sudo systemctl enable fail2ban
sudo systemctl restart fail2ban'

echo "==> Creating docroot $REMOTE_DIR ..."
ssh "$REMOTE" "sudo mkdir -p '$REMOTE_DIR' && sudo chown -R bbot:www-data '$REMOTE_DIR' && sudo chmod -R g+w '$REMOTE_DIR'"

echo "==> Installing nginx vhost ..."
scp "$ROOT/ops/nginx-ellen.conf" "$REMOTE:/tmp/nginx-ellen.conf"
ssh "$REMOTE" "sudo mv /tmp/nginx-ellen.conf /etc/nginx/sites-available/$NGINX_SITE && sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/$NGINX_SITE"

echo "==> Opening UFW port 8080 ..."
ssh "$REMOTE" 'sudo ufw allow 8080/tcp comment "Ellen English Studio"'

echo "==> Enabling nginx ..."
ssh "$REMOTE" 'sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx'

echo "==> HK1 setup complete."
echo "    Next: ../scripts/deploy-hk1.sh"
