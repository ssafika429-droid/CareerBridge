# Responsible AI — CareerBridge AI

Dokumen ini adalah satu-satunya rujukan aturan Responsible AI untuk seluruh flow CareerBridge. Aturan yang sama ditulis ulang di dalam setiap Prompt Template pada file flow karena setiap node prompt harus berdiri sendiri. Jika aturan di sini diubah, ubah juga teks prompt pada semua flow dan perbarui kasus uji pada `tests/`.

CareerBridge adalah alat panduan pengembangan karier. Alat ini bukan sistem rekrutmen dan tidak boleh dipakai untuk menilai kelayakan seseorang.

## Aturan bersama (Level 1, 2, dan 3)

1. **Berbasis bukti.** Model hanya boleh memakai informasi yang ada pada input. Model tidak boleh mengarang skill, pengalaman, proyek, perusahaan, jabatan, angka, persentase, sertifikasi, teknologi, jadwal, atau URL.
2. **Bukti tidak cukup.** Jika bukti tidak memadai, nilai yang dituliskan adalah `insufficient evidence`. Model tidak boleh mengisinya dengan dugaan.
3. **Atribut sensitif diabaikan.** Gender, agama, ras, etnis, kesehatan, disabilitas, usia, status pernikahan, kewarganegaraan, dan sejenisnya tidak boleh dipakai untuk analisis apa pun.
4. **Bukan keputusan rekrutmen.** Model tidak boleh menghasilkan hired, rejected, qualified, unqualified, hiring score, atau hiring probability.
5. **Fakta dan saran dipisahkan.** Fakta berasal dari data pengguna, saran berasal dari model. Pada Level 3, saran hanya boleh muncul pada field khusus saran (misalnya `portfolio_suggestions`).
6. **Pengguna memvalidasi.** Setiap keluaran harus diperiksa dan dikoreksi pengguna. Flow menyertakan catatan validasi (`validation_questions`, `uncertainty_note`, `responsible_ai_note`, atau `validation_note`) sesuai tahapnya.
7. **Tanpa nama kursus, sertifikasi, atau URL karangan.** Resource hanya boleh berasal dari hasil pencarian yang nyata.
8. **Format keluaran.** Model membalas dengan satu objek JSON valid, tanpa teks lain dan tanpa pembungkus code fence, dalam bahasa yang sama dengan input pengguna.

## Aturan tambahan per level

**Level 2 — Data & Personalization.** Data lama dari database dan data terbaru dari pengguna harus dibedakan. Sebuah skill tidak dianggap meningkat karena waktu berlalu. Skill hanya dianggap menguat jika data terbaru memuat evidence baru yang tidak ada pada data lama, dan evidence itu disebut secara eksplisit. Jika bagian riwayat kosong atau bernilai `NEEDS_CONFIGURATION`, riwayat tersebut diperlakukan sebagai tidak tersedia dan progres tidak boleh disimpulkan darinya. Model tidak boleh membuat `analysis_id` atau tanggal, karena itu ditetapkan oleh sistem penyimpan.

**Level 3 — Action & Automation.** Aksi eksternal yang penting memerlukan persetujuan pengguna. Pada flow saat ini, cabang `calendar_event` melewati node Human Approval sebelum payload event dibuat. Model tidak boleh menentukan jadwal yang tidak disebut pengguna. Bila waktu tidak disebut, nilainya `insufficient evidence`. Kredensial (IBM watsonx, Astra DB, Composio, kalender) tidak pernah ditulis di file flow dan hanya diatur lewat konfigurasi Langflow atau variabel lingkungan.

## Batasan yang perlu diketahui

Aturan di atas bekerja melalui instruksi prompt, sehingga tidak ada jaminan mutlak bahwa model selalu mematuhinya. Kepatuhan hanya dapat dinilai lewat pengujian. Kasus uji pada `tests/cases/` (input sparse, prompt injection, dan atribut sensitif) ada untuk memeriksa hal ini pada setiap perubahan prompt atau model.
