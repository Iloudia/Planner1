# Deploy on VPS

## Target layout
- App checkout: `/var/www/planner/current`
- Static build: `/var/www/planner/current/dist`
- Shared media: `/var/www/planner/shared/media`
- Env file: `/etc/planner/planner.env`
- Nginx site: `/etc/nginx/sites-available/planner.conf`
- systemd unit: `/etc/systemd/system/planner-api.service`

## DNS
- Point `nomdns.com` to `148.113.191.155`
- Point `www.nomdns.com` to the same host

## Server packages
```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## App directories
```bash
sudo mkdir -p /var/www/planner/shared/media
sudo mkdir -p /var/www/planner/shared/downloads
sudo mkdir -p /var/www/certbot
sudo mkdir -p /etc/planner
sudo chown -R ubuntu:ubuntu /var/www/planner
sudo chown -R ubuntu:ubuntu /var/www/certbot
sudo chown -R ubuntu:ubuntu /etc/planner
```

## App env
Create `/etc/planner/planner.env`:

```env
HOST=127.0.0.1
PORT=4242
TRUST_PROXY=1
APP_BASE_URL=https://nomdns.com
CORS_ORIGINS=https://nomdns.com,https://www.nomdns.com
MEDIA_PUBLIC_BASE_URL=/media
MEDIA_ROOT_DIR=/var/www/planner/shared/media
FIREBASE_PROJECT_ID=meandrituals-72041
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
DOWNLOAD_TOKEN_SECRET=...
RESEND_API_KEY=...
EMAIL_FROM=...
DOWNLOADS_DIR=/var/www/planner/shared/downloads
```

## App release
```bash
cd /var/www/planner
git clone <repo> current
cd current
npm install
npm run build
```

## systemd
```bash
sudo cp deploy/systemd/planner-api.service /etc/systemd/system/planner-api.service
sudo systemctl daemon-reload
sudo systemctl enable planner-api
sudo systemctl restart planner-api
sudo systemctl status planner-api
```

## Nginx
```bash
sudo cp deploy/nginx/planner.conf /etc/nginx/sites-available/planner.conf
sudo ln -sf /etc/nginx/sites-available/planner.conf /etc/nginx/sites-enabled/planner.conf
sudo nginx -t
sudo systemctl reload nginx
```

## HTTPS
Run Certbot after DNS is live:

```bash
sudo certbot --nginx -d nomdns.com -d www.nomdns.com
```

## Validate
```bash
curl -I http://127.0.0.1:4242/api/custom-products
curl -I https://nomdns.com
curl -I https://nomdns.com/api/custom-products
```
