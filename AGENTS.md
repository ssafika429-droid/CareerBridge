# Instruksi untuk Agen AI — CareerBridge AI

Berkas ini dibaca oleh agen coding (misalnya IBM Bob) sebelum mengubah repository. Baca juga `README.md`, `docs/flows.md`, dan `docs/responsible-ai.md`.

## Ringkasan proyek

CareerBridge AI adalah kumpulan flow Langflow 1.11.5 dengan IBM Granite (IBM watsonx.ai) untuk panduan pengembangan karier. Level 1 menganalisis profil dan menyusun rencana latihan 4 minggu, Level 2 menambah data dan personalisasi lewat Astra DB, Level 3 menambah aksi dan otomatisasi. Proyek ini bukan sistem rekrutmen.

## Struktur

```text
langflow/       tiga file flow (level-1, level-2, level-3), sumber kebenaran logika dan prompt
sample-input/   contoh input Level 1
tests/          skema keluaran, kasus uji, dan panduan pengujian manual
docs/           kontrak flow dan aturan Responsible AI
```

## Aturan wajib

1. **Jangan mengarang struktur Langflow.** Jangan menebak atau menulis tangan ID node, port, handle edge, atau tipe komponen. File flow hanya boleh diubah dengan mengekspor ulang dari Langflow 1.11.5, atau dengan mengubah nilai field yang strukturnya sudah ada (misalnya teks Prompt Template) tanpa mengubah kerangka node dan edge. Setelah mengubah, pastikan JSON tetap valid dan setiap edge menunjuk node serta field yang ada.
2. **IBM Granite tetap menjadi model.** Jangan mengganti dengan Gemini, OpenAI, Claude, atau model lain, dan jangan menebak nama model Granite. Nama model dipilih lewat antarmuka Langflow.
3. **Tanpa kredensial di repository.** Jangan menulis API key, token, project ID milik pengguna, atau rahasia lain ke file mana pun. Gunakan variabel lingkungan dan Global Variables Langflow (lihat `.env.example`). Jangan menambahkan `.env` ke commit.
4. **Bagian yang belum bisa diverifikasi ditandai `NEEDS_CONFIGURATION`.** Jangan membuat node palsu agar tampak lengkap, dan jangan menyatakan sebuah flow "siap import" sebelum diuji di Langflow. Status pengujian dicatat di `docs/flows.md` dan `tests/README.md`.
5. **Prompt hidup di dalam file flow.** Jangan membuat salinan prompt di folder lain. Aturan Responsible AI diulang di setiap Prompt Template; jika aturan berubah, ubah di semua prompt, perbarui `docs/responsible-ai.md`, dan sesuaikan kasus uji di `tests/cases/`.
6. **Jaga kontrak keluaran.** Jika skema keluaran sebuah flow berubah, perbarui `tests/schemas/` dan `docs/flows.md` pada perubahan yang sama.
7. **Jangan membuat file di luar struktur di atas tanpa alasan yang jelas.** Tambahkan dokumentasi hanya jika benar-benar membantu.

## Aturan perilaku model (harus tetap dipertahankan pada setiap prompt)

- Hanya memakai informasi dari input pengguna; bukti yang tidak cukup ditulis `insufficient evidence`.
- Tidak membuat keputusan rekrutmen dan tidak menyatakan pengguna qualified atau unqualified.
- Tidak memakai atribut sensitif; tidak mengarang skill, pengalaman, angka, sertifikasi, atau URL.
- Keluaran berupa satu objek JSON valid tanpa teks lain dan tanpa code fence.
- Aksi eksternal yang penting (misalnya kalender) memerlukan persetujuan pengguna sebelum dijalankan.

## Gaya penulisan

Dokumentasi ditulis dalam bahasa Indonesia yang formal dan jelas. Nama file, kunci JSON, dan istilah teknis tetap dalam bahasa aslinya.

## Untuk pengguna IBM Bob

Berkas ini cukup sebagai instruksi tingkat repository. Folder `.bob/` (aturan atau mode kustom) hanya ditambahkan jika benar-benar dibutuhkan. Jangan menyimpan token atau konfigurasi MCP yang berisi rahasia di dalam repository.
