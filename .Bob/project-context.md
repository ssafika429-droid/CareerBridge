# Konteks Proyek — CareerBridge AI

CareerBridge AI (AI Career Readiness & Skill Gap Navigator) adalah tiga flow Langflow 1.11.5 yang memakai IBM Granite lewat IBM watsonx.ai untuk membantu mahasiswa memahami skill gap terhadap peran yang dituju dan menyusun rencana pengembangan. Ini panduan pengembangan karier, bukan alat rekrutmen. Aturan Responsible AI ada di `docs/responsible-ai.md`. Kontrak input dan output ada di `docs/flows.md`.

Status keseluruhan: struktur JSON sudah diperiksa, tetapi **belum ada flow yang diuji di Langflow**.

## Implementasi aktual (dari audit file di `langflow/`)

**Level 1 — `level-1-careerbridge-main.json` (7 node).** Satu Chat Input berisi JSON tujuh kunci, Career Analyzer (Prompt + Language Model), lalu Training Planner (Prompt + Language Model) yang menerima hasil analisis dan profil asli. Dua Chat Output: Career Analysis JSON dan 4-Week Training Plan JSON.

**Level 2 — `level-2-data-personalization.json` (14 node).** Empat node Astra DB Data API (operasi Find) membaca `user_profile`, `career_history`, `skill_progress`, dan `training_progress` dengan filter `user_id`; masing-masing melalui Parser (Stringify) ke satu Prompt Template bersama data terbaru dari Chat Input; Language Model; Structured Output (`user_id` dan delapan field progres); lalu satu node Astra DB yang menyimpan hasil ke koleksi `career_history` (insert, bukan update); lalu Chat Output.

**Level 3 — `level-3-action-automation.json` (30 node).** Current Date dan Chat Input masuk ke Action Planner (Prompt, Language Model, Structured Output). Empat router If-Else berantai membaca `action_type`:
- `calendar_event`: node Human Input (Approve atau Reject) dengan Chat Output berisi teks persetujuan.
- `cv_generation`: Language Model menghasilkan konten CV.
- `resource_search`: node Web Search, lalu Language Model memilih resource.
- `reminder`: payload JSON `learning_reminder` dari node Parser, tanpa panggilan model.
- `learning_action` (bawaan): Language Model menyusun satu learning action.

## Yang TIDAK ada pada flow (jangan ditulis sebagai fitur)

- **Agent dan tool-calling**: tidak ada komponen Agent; pemilihan aksi memakai router.
- **MCP**: tidak ada komponen atau konfigurasi MCP pada flow mana pun.
- **Google Calendar**: node Composio Google Calendar ada di kanvas tetapi tidak terhubung ke node lain (tanpa edge) dan aksinya belum dipilih (`disabled`). Tidak ada event kalender yang dibuat.
- **Timer**: tidak ada komponen Timer bawaan.
- **CV Generator di Level 1**: hanya ada pada cabang `cv_generation` Level 3.
- **Pembaruan data di Astra DB**: hanya insert.
- **Model terpilih**: provider dan model pada semua node Language Model masih kosong; dipilih lewat antarmuka Langflow.

## Kredensial yang dirujuk flow

`ASTRA_DB_APPLICATION_TOKEN` (Level 2, semua node Astra DB) dan `COMPOSIO_API_KEY` (Level 3, node Composio). API key watsonx tidak dirujuk lewat variabel di file flow dan diisi di antarmuka. Nilai asli tidak pernah ditulis di repository.

## Peta folder

| Folder atau berkas | Isi |
|---|---|
| `langflow/` | tiga flow; tempat prompt berada (jangan membuat folder `prompts/`) |
| `sample-input/career-profile.json` | input contoh Level 1 |
| `sample-data/` | data fiktif untuk Level 2 (`user_id` `demo-user-001`) dan input Level 3 (`action-request.json`) |
| `expected-output/` | contoh keluaran bertanda `.example.json`; status EXAMPLE ONLY |
| `tests/` | skema keluaran (Level 1 dan 3), kasus uji, dan panduan uji manual |
| `docs/` | kontrak flow dan Responsible AI |
| `mcp-config.example.json` | templat kosong; belum ada MCP yang dipakai |
