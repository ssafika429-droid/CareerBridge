# Expected Output — CareerBridge AI

**Status: EXAMPLE ONLY / NOT VERIFIED.**

Semua file di folder ini adalah contoh yang disusun tangan agar sesuai dengan skema dan aturan prompt. File-file ini **bukan** keluaran IBM Granite dan belum pernah dihasilkan oleh flow yang dijalankan di Langflow. Akhiran `.example.json` sengaja dipakai agar tidak tertukar dengan hasil uji nyata, dan JSON tidak diberi field penanda karena skema melarang field tambahan. Ganti atau tambahkan file hasil run nyata setelah flow diuji.

## Pemetaan

| File | Flow / cabang | Skema | Input |
|---|---|---|---|
| `level-1-career-analysis.example.json` | Level 1, keluaran 1 | `tests/schemas/career-analysis.schema.json` | `sample-input/career-profile.json` |
| `level-1-training-plan.example.json` | Level 1, keluaran 2 | `tests/schemas/training-plan.schema.json` | `sample-input/career-profile.json` |
| `level-2-progress-analysis.example.json` | Level 2 | tidak ada file skema; diperiksa terhadap skema node Structured Output pada flow | `sample-data/current-data.json` + empat koleksi di `sample-data/` |
| `level-3-action-plan.example.json` | Level 3, rencana aksi (permintaan `calendar_event`) | `tests/schemas/action-automation.schema.json` | `sample-data/action-request.json` |
| `level-3-learning-reminder.example.json` | Level 3, cabang reminder | `tests/schemas/action-automation.schema.json` | `sample-data/action-request.json` |
| `level-3-learning-action.example.json` | Level 3, cabang learning_action | `tests/schemas/action-automation.schema.json` | `sample-data/action-request.json` |
| `level-3-resource-recommendations.example.json` | Level 3, cabang resource_search | `tests/schemas/action-automation.schema.json` | `sample-data/action-request.json` |
| `level-3-cv-generation.example.json` | Level 3, cabang cv_generation | `tests/schemas/cv-generator.schema.json` | `sample-data/action-request.json` |

## Catatan per file

- **Level 1 tidak memiliki CV Generator.** Contoh CV berada pada Level 3.
- **Level 2.** Data lama adalah analisis tanggal 2026-09-15 pada `sample-data/career-history.json`. `analysis_id` dan `created_at` pada data itu diisi manual karena tidak ada komponen di flow yang membuatnya. Filter `user_id` pada empat node Astra DB READ harus diisi `demo-user-001` sebelum dijalankan.
- **Level 3, jadwal.** Nilai `schedule` `2026-10-02T19:00:00` mengandaikan flow dijalankan pada 2026-10-01 karena "besok" dihitung dari node Current Date. Sesuaikan jika dijalankan pada hari lain.
- **Level 3, resource.** `resources` sengaja kosong karena URL tidak boleh dibuat tanpa hasil pencarian web nyata.
- **Cabang kalender tidak dibuatkan contoh.** Dua Chat Output kalender berisi teks persetujuan dari node Human Input (bukan JSON), dan node Composio Google Calendar belum terhubung ke node mana pun serta belum memiliki aksi terpilih. Tidak ada klaim bahwa event kalender pernah dibuat.
- Nilai `estimated_time`, `recommendations`, dan `portfolio_suggestions` adalah saran, bukan fakta dari data pengguna.
