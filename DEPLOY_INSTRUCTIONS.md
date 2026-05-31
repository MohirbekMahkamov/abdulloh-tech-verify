# XENOR X (xenorx.uz) Serverga Joylash va Domen Sozlash Qo'llanmasi

Ushbu qo'llanma orqali siz yaratilgan **XENOR X** online do'kon va mahsulot tasdiqlash tizimini o'zingizning serveringizga (VPS) o'rnatishingiz va **Eskiz.uz** dan olingan `xenorx.uz` domeniga bog'lashingiz mumkin.

---

## 1. Eskiz.uz da Domen Sozlash
1. **Eskiz.uz** kabinetingizga kiring va **Domenlar** bo'limiga o'ting.
2. `xenorx.uz` domenining DNS sozlamalariga kiring (**DNS Sozlash** yoki **Управление DNS**).
3. Quyidagi **A** yozuvlarini (A Records) qo'shing:
   
   | Name / Host | Type | Value / Address | TTL |
   | :--- | :--- | :--- | :--- |
   | `@` | A | `Sizning_Server_IP` (Masalan: `95.21.34.88`) | 3600 |
   | `www` | A | `Sizning_Server_IP` (Masalan: `95.21.34.88`) | 3600 |
   | `api` | A | `Sizning_Server_IP` (Masalan: `95.21.34.88`) | 3600 |

*Eslatma: DNS yozuvlari butun dunyo bo'ylab yangilanishi 1 soatdan 24 soatgacha vaqt olishi mumkin.*

---

## 2. Serverga Dasturlarni O'rnatish (Ubuntu 22.04+)

Serveringizga SSH orqali kiring va tizimni yangilang:
```bash
sudo apt update && sudo apt upgrade -y
```

### Java 21 O'rnatish (Backend uchun):
```bash
sudo apt install openjdk-21-jdk openjdk-21-jre -y
```

### Node.js va PM2 O'rnatish (Frontend uchun):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -y -g pm2
```

### PostgreSQL va Redis O'rnatish:
```bash
sudo apt install postgresql postgresql-contrib redis-server -y
```

---

## 3. Ma'lumotlar Bazasi Sozlamalari

1. PostgreSQL konsoliga kiring:
   ```bash
   sudo -i -u postgres psql
   ```
2. Yangi ma'lumotlar bazasi va foydalanuvchi yarating:
   ```sql
   CREATE DATABASE abdulloh_verify;
   CREATE USER postgres WITH PASSWORD '1';
   GRANT ALL PRIVILEGES ON DATABASE abdulloh_verify TO postgres;
   \q
   ```
3. Redis holatini tekshiring (ishlab turgan bo'lishi kerak):
   ```bash
   sudo systemctl status redis-server
   ```

---

## 4. Backend (Spring Boot) Deploy

1. O'zingizning kompyuteringizda backend loyihasini yig'ing (jar fayl yaratish):
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```
2. Hosil bo'lgan `target/verify-0.0.1-SNAPSHOT.jar` faylini serverga yuklang (Masalan `/var/www/xenor-backend/` papkasiga).
3. Serverda systemd servisini yarating, shunda backend avtomatik ravishda fonda ishlaydi va tizim qayta yonganda ishga tushadi:
   ```bash
   sudo nano /etc/systemd/system/xenor-backend.service
   ```
   Quyidagi tekstni kiriting:
   ```ini
   [Unit]
   Description=XENOR X Backend Spring Boot Application
   After=syslog.target

   [Service]
   User=root
   ExecStart=/usr/bin/java -jar /var/www/xenor-backend/verify-0.0.1-SNAPSHOT.jar
   SuccessExitStatus=143
   Environment=JWT_SECRET=super_secure_secret_key_for_xenor_x_verification_system_2026
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```
4. Servisni yoqing va ishga tushiring:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable xenor-backend
   sudo systemctl start xenor-backend
   ```

---

## 5. Frontend (Next.js) Deploy

1. Frontend fayllarni serverga yuklang (Masalan `/var/www/xenor-frontend/` papkasiga).
2. Frontend serverda `package.json` o'rnatilgan joyga o'ting:
   ```bash
   cd /var/www/xenor-frontend
   ```
3. API manzilini yangilang. `.env.production` faylini yarating:
   ```bash
   nano .env.production
   ```
   Quyidagi qiymatni yozing:
   ```env
   NEXT_PUBLIC_API_URL=https://api.xenorx.uz/api/v1
   ```
4. Kutubxonalarni o'rnating va ishlab chiqarish uchun loyihani yig'ing (build):
   ```bash
   npm install
   npm run build
   ```
5. PM2 orqali Next.js ilovasini ishga tushiring:
   ```bash
   pm2 start npm --name "xenor-frontend" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```

---

## 6. Nginx va SSL (HTTPS) Sozlash

Nginx va Let's Encrypt o'rnatish:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Nginx Konfiguratsiyasi:
Yangi Nginx konfiguratsiya faylini yarating:
```bash
sudo nano /etc/nginx/sites-available/xenorx.uz
```
Quyidagi sozlamalarni joylashtiring (Server IP manzili va domenlaringizga moslab):
```nginx
# API server (api.xenorx.uz)
server {
    listen 80;
    server_name api.xenorx.uz;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded-for;
    }
}

# Frontend Store & Verification (xenorx.uz & www.xenorx.uz)
server {
    listen 80;
    server_name xenorx.uz www.xenorx.uz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded-for;
    }
}
```

Konfiguratsiyani tekshiring va Nginx ni qayta yuklang:
```bash
sudo ln -s /etc/nginx/sites-available/xenorx.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL (Bepul HTTPS) sertifikatini o'rnatish:
```bash
sudo certbot --nginx -d xenorx.uz -d www.xenorx.uz -d api.xenorx.uz
```
Certbot avtomatik ravishda SSL sertifikatlarini o'rnatadi va HTTP so'rovlarni xavfsiz HTTPS ga yo'naltiradi.

---

## Tizim Tayyor!
Endi foydalanuvchilar brauzerda:
- `https://xenorx.uz` - chiroyli kompyuter texnikalari do'koniga kira oladilar.
- `https://xenorx.uz/verify` yoki QR-kod orqali `https://xenorx.uz/verify?code=...` - mahsulotlarni tekshira oladilar.
- Adminlar `https://xenorx.uz/admin` orqali to'liq boshqaruv paneliga ega bo'ladilar.
