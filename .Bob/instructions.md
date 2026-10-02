# Instruksi Kerja untuk Bob — CareerBridge AI

## Peran Bob pada proyek ini

IBM Bob adalah asisten pengembangan (development assistant) untuk repository ini. Bob membantu membaca, memeriksa, dan merapikan file proyek. Bob **bukan** model runtime CareerBridge. Model yang menjalankan flow adalah IBM Granite melalui IBM watsonx.ai, dan itu diatur di Langflow, bukan di folder ini. Jangan menulis atau menyiratkan bahwa Bob menghasilkan keluaran flow.

## Aturan utama

Aturan wajib lengkap ada di `AGENTS.md` (root) dan wajib dibaca lebih dulu. Berkas ini tidak mengulangnya. Tambahan khusus Bob:

1. **Export Langflow aktual adalah sumber kebenaran.** Sebelum menyebut sebuah node, port, field, provider, atau integrasi, buktikan keberadaannya dari file di `langflow/`. Jika tidak terlihat di sana, jangan menyebutnya sebagai fitur yang ada.
2. **Jangan mengubah file flow secara sembarangan.** Perubahan struktur dilakukan dengan mengekspor ulang dari Langflow 1.11.5. Jangan menulis tangan ID node, handle edge, atau tipe komponen.
3. **Bedakan status.** Tulis "IMPLEMENTED" untuk yang ada di flow, "PLANNED" untuk rencana, dan "NOT VERIFIED" untuk yang belum diuji di Langflow. Jangan memakai kata "import-ready", "fully working", atau "verified" tanpa uji nyata.
4. **Jangan memasukkan rahasia.** API key, token, project ID milik pengguna, dan kredensial lain tidak boleh ditulis ke file mana pun, termasuk contoh. Gunakan `.env` (tidak di-commit) dan Global Variables Langflow.
5. **Jangan membuat contoh keluaran yang dipalsukan sebagai hasil nyata.** Isi `expected-output/` adalah contoh (`.example.json`) sampai diganti hasil run Langflow yang sebenarnya.

## Setelah setiap perubahan

Jalankan langkah pada `validation-checklist.md`. Jika kontrak keluaran, prompt, atau data sample berubah, perbarui juga `tests/schemas/`, `docs/flows.md`, `sample-data/`, dan `expected-output/` dalam perubahan yang sama.

## Catatan format `.bob/`

Folder ini memakai huruf kecil `.bob/` dan subfolder `rules/` karena itulah yang dibaca Bob menurut dokumentasi resminya: setiap berkas aturan di `.bob/rules/` disertakan pada percakapan di semua mode. Pada sistem berkas yang membedakan huruf besar-kecil, `.Bob/` tidak akan terbaca. Mode kustom (`.bob/custom_modes.yaml`) dan folder `rules-{mode}/` sengaja tidak dibuat karena belum ada kebutuhan. Konfigurasi MCP proyek akan berada di `.bob/mcp.json`; berkas itu tidak ada karena proyek ini belum memakai MCP, dan jika dibuat harus tetap di luar commit.
