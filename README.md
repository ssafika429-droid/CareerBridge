# CareerBridge AI

CareerBridge AI adalah kumpulan flow Langflow yang memakai IBM Granite (IBM watsonx.ai) untuk membantu pengguna memahami kesenjangan skill terhadap peran yang dituju dan menyusun rencana pengembangan. Sistem ini adalah panduan pengembangan karier, bukan alat rekrutmen, dan tidak menghasilkan keputusan seperti diterima, ditolak, atau layak.

Status: seluruh flow dibuat untuk Langflow 1.11.5 dan struktur JSON-nya sudah diperiksa, tetapi **belum diuji di Langflow**. Bagian yang butuh konfigurasi ditandai `NEEDS_CONFIGURATION` pada `docs/flows.md`.

## Arsitektur

| Level | Fokus | File | Isi |
|---|---|---|---|
| 1 | AI Core | `langflow/level-1-careerbridge-main.json` | Career Analyzer lalu Training Planner (rencana 4 minggu), keduanya memakai Granite |
| 2 | Data & Personalization | `langflow/level-2-data-personalization.json` | Membaca riwayat dari Astra DB, menganalisis progres bersama data terbaru, menyimpan hasilnya |
| 3 | Action & Automation | `langflow/level-3-action-automation.json` | Granite menentukan aksi (pengingat, kalender dengan persetujuan, konten CV, pencarian resource, learning action) |

Ketiga flow berdiri sendiri dan tidak saling memanggil di Langflow. Kontrak input dan output masing-masing ada di `docs/flows.md`.

## Struktur repository

```text
langflow/       flow Level 1, 2, dan 3
sample-input/   contoh input Level 1 (career-profile.json)
tests/          skema keluaran, kasus uji, dan panduan pengujian manual
docs/           kontrak flow dan aturan Responsible AI
.env.example    daftar nama variabel lingkungan (tanpa nilai)
AGENTS.md       instruksi untuk agen AI coding
```

## Prasyarat

- Langflow versi 1.11.5 (pasang mengikuti dokumentasi resmi Langflow).
- Akun IBM Cloud dengan layanan watsonx.ai: API key, Project ID, dan model Granite yang tersedia di regionmu.
- Level 2: database Astra DB dan token aplikasi. Level 3: akun Composio dan kalender yang akan dihubungkan.

## Cara menjalankan Level 1

1. Salin `.env.example` menjadi `.env`, lalu isi `WATSONX_API_KEY` (dan `WATSONX_PROJECT_ID` sebagai catatan). Jangan commit `.env`.
2. Jalankan Langflow dengan berkas lingkungan tersebut, misalnya `uv run langflow run --env-file .env`.
3. Di Langflow, import `langflow/level-1-careerbridge-main.json`.
4. Pada kedua node Language Model ("Career Analyzer - IBM Granite" dan "Training Planner - IBM Granite"): pilih provider IBM watsonx.ai, pilih model Granite, isi API key (pilih variabel `WATSONX_API_KEY` lewat ikon globe), Project ID, dan endpoint sesuai regionmu. Field-field ini sengaja kosong di file flow.
5. Buka Playground dan tempel isi `sample-input/career-profile.json` sebagai satu pesan.
6. Dua keluaran akan muncul: Career Analysis JSON dan 4-Week Training Plan JSON.

Level 2 dan Level 3 membutuhkan konfigurasi tambahan (Astra DB dan Composio). Langkahnya tercantum per flow pada `docs/flows.md`.

## Pengujian

Pengujian dilakukan manual di Langflow terhadap skema di `tests/schemas/` dan tiga kasus di `tests/cases/` (input sparse, prompt injection, atribut sensitif). Panduannya ada di `tests/README.md`. Belum ada pengujian yang dijalankan.

## Responsible AI

Keluaran hanya boleh berdasar data yang diberikan pengguna, bukti yang tidak cukup ditulis `insufficient evidence`, atribut sensitif tidak dipakai, dan tidak ada keputusan rekrutmen. Pengguna wajib memeriksa hasil sebelum memakainya, dan aksi eksternal yang penting memerlukan persetujuan. Aturan lengkapnya ada di `docs/responsible-ai.md`.

## Keamanan

Kredensial tidak pernah disimpan di repository. Gunakan variabel lingkungan atau Global Variables Langflow. Jika mengekspor flow dari Langflow, jangan centang opsi penyimpanan API key, dan periksa berkas sebelum commit.

## Batasan yang diketahui

- Level 1 belum terbukti berhasil di-import dan dijalankan.
- Komponen Astra DB, Structured Output, dan komponen Level 3 dibangkitkan dari kode sumber paket Langflow, bukan dari export, sehingga kesesuaiannya baru terbukti setelah import berhasil.
- Level 2 menyimpan hasil sebagai dokumen baru (insert), bukan memperbarui dokumen yang ada. Level 3 tidak memiliki komponen Timer bawaan dan belum membuat event kalender otomatis.
- Rincian lengkap ada di `docs/flows.md`.
"# CareerBridge" 
