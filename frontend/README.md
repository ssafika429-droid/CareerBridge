# CareerBridge AI Frontend

Antarmuka React dan Vite untuk demo CareerBridge AI. Aplikasi ini tidak mengubah flow Langflow, Astra DB, Composio, atau konfigurasi kredensial pada repository utama.

## Menjalankan aplikasi

```bash
cd frontend
npm install
npm run dev
```

Untuk build produksi:

```bash
npm run build
```

## Mode demo

Mode demo adalah mode bawaan jika `VITE_LANGFLOW_BASE_URL` dan `VITE_LANGFLOW_FLOW_ID` kosong. Assessment, hasil analisis, roadmap, aksi, dan progres menggunakan data contoh yang terlihat sebagai `Demo data` pada antarmuka. Tidak ada panggilan ke Langflow, Google Calendar, Astra DB, atau Composio dalam mode ini.

## Mode Langflow Level 1

Salin `.env.example` menjadi `.env` di folder ini, lalu isi kedua nilai berikut tanpa menyertakan API key atau token:

```text
VITE_LANGFLOW_BASE_URL=
VITE_LANGFLOW_FLOW_ID=
```

Service mengirim satu Chat Input yang berisi tujuh kunci kontrak Level 1. Integrasi ini belum diverifikasi terhadap instance Langflow aktif, sehingga statusnya `NEEDS_CONFIGURATION` sampai endpoint, flow ID, CORS, dan format respons Chat Output diuji.

Level 2 (progress), Level 3 (resource search), dan Google Calendar tetap mock atau tidak terhubung. Konfigurasi flow terkait harus dilakukan di Langflow; frontend ini tidak membuat atau mengubah endpoint maupun flow.
