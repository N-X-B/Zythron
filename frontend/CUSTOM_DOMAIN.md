# Connecting a Custom Domain to Zythron

This guide explains how to connect and configure your custom domain (e.g., `zythron.dev` or `app.yourdomain.com`).

---

## 1. Hosting on Vercel (Recommended for Next.js)

1. **Deploy the repository**:
   Push the code to GitHub and import the project into your Vercel team account (`Root Directory: frontend`).
2. **Open Project Settings**:
   Navigate to **Project Settings** > **Domains**.
3. **Add Domain**:
   Enter your domain name (e.g. `career.yourdomain.com` or `yourdomain.com`).
4. **Configure DNS Records at your Registrar** (e.g. Namecheap, Cloudflare, GoDaddy):
   - **For Subdomains** (e.g. `career.yourdomain.com`):
     - **Type**: `CNAME`
     - **Name**: `career`
     - **Value**: `cname.vercel-dns.com`
     - **TTL**: Automatic or 300
   - **For Apex Domains** (e.g. `yourdomain.com`):
     - **Type**: `A`
     - **Name**: `@`
     - **Value**: `76.76.21.21`
     - **TTL**: Automatic or 300
5. **SSL Certificate**:
   Vercel automatically provisions and renews a Let's Encrypt SSL/TLS certificate once DNS resolves.

---

## 2. Hosting on Cloudflare Pages / Workers

1. Under **Workers & Pages**, select your project and click **Custom Domains**.
2. Enter your custom domain name.
3. If using Cloudflare DNS, the `CNAME` is routed automatically. If using external DNS, configure:
   - **Type**: `CNAME`
   - **Name**: Subdomain prefix or `@`
   - **Value**: `<project>.pages.dev`

---

## 3. Self-Hosted / Reverse Proxy (Nginx / Caddy)

If hosting on a Linux VPS with Docker:

```nginx
server {
    listen 80;
    server_name career.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name career.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/career.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/career.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Verification Checklist

- [ ] DNS propagated (check with `nslookup career.yourdomain.com` or `dig career.yourdomain.com`)
- [ ] HTTPS lock icon active and valid
- [ ] Root path (`/`), `/privacy`, and `/terms` resolve without redirect loops
