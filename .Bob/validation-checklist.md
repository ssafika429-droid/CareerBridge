# Daftar Periksa Validasi — CareerBridge AI

Jalankan setelah setiap perubahan. Centang hanya yang benar-benar diperiksa, dan catat yang tidak bisa diperiksa sebagai NOT VERIFIED.

## 1. Berkas JSON

- [ ] Semua `.json` dapat di-parse (contoh: `python -m json.tool <berkas>`), tanpa trailing comma.
- [ ] Tiga flow di `langflow/` tidak berubah, kecuali memang diekspor ulang dari Langflow 1.11.5 dengan sengaja.
- [ ] Jika sebuah flow diubah: ID node unik, setiap edge menunjuk node dan field yang ada, dan tidak ada siklus.

## 2. Skema dan kontrak

- [ ] Keluaran (atau contoh) divalidasi terhadap skema yang sesuai di `tests/schemas/` (misalnya `check-jsonschema --schemafile tests/schemas/<nama>.schema.json <berkas>`).
- [ ] Jika kontrak keluaran berubah, `tests/schemas/` dan `docs/flows.md` diperbarui pada perubahan yang sama.
- [ ] Level 2 tidak memiliki file skema; keluarannya diperiksa terhadap field pada node Structured Output di flow.

## 3. Konsistensi data

- [ ] `sample-input/career-profile.json` masih memiliki tujuh kunci yang diminta prompt Level 1.
- [ ] Semua file di `sample-data/` memakai `user_id` yang sama, dan nilainya sama dengan yang diisi pada filter node Astra DB READ saat uji.
- [ ] Isi `user-profile.json`, `career-history.json`, dan `expected-output/level-1-*.example.json` tetap selaras.
- [ ] Tiap `evidence` pada contoh analisis adalah kutipan dari input.

## 4. Rahasia

- [ ] Tidak ada API key, token, password, atau secret OAuth di berkas mana pun (periksa dengan `grep -rEn "sk-[A-Za-z0-9]{10,}|AstraC[S]:|AIza[0-9A-Za-z_-]{20,}|Bearer [A-Za-z0-9._-]{20,}" .`).
- [ ] `.env` dan `.bob/mcp.json` tidak ikut commit; `.env.example` hanya berisi nama variabel tanpa nilai.
- [ ] Export flow dari Langflow dibuat tanpa menyimpan API key.

## 5. Kejujuran klaim

- [ ] Tidak ada klaim Agent, MCP, atau event Google Calendar yang tidak ada di flow.
- [ ] Bob tidak disebut sebagai model runtime.
- [ ] Tidak ada kata "import-ready", "fully working", atau "verified" tanpa uji nyata di Langflow.
- [ ] Contoh keluaran tetap berlabel EXAMPLE ONLY sampai diganti hasil run nyata.
- [ ] Tidak ada folder `prompts/` dan tidak ada salinan prompt di luar file flow.

## 6. Setelah uji nyata di Langflow

- [ ] Catat hasil pada tabel di `tests/README.md` (tanggal, model Granite, kasus, hasil).
- [ ] Perbarui kolom status pada `docs/flows.md` dan kalimat "belum diuji" pada `README.md`.
- [ ] Ganti atau tambahkan contoh keluaran dengan hasil run yang sebenarnya.
