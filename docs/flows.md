# Kontrak Flow — CareerBridge AI

Dokumen ini menjelaskan input, alur, output, dan konfigurasi setiap flow Langflow pada repository ini. Aturan Responsible AI yang berlaku untuk semua flow ada di `responsible-ai.md`.

## Ringkasan

| Flow | File | Node / Edge | Status |
|---|---|---|---|
| Level 1 — Career Analyzer + Training Planner | `langflow/level-1-careerbridge-main.json` | 7 / 7 | Struktur diperiksa, belum diuji di Langflow |
| Level 2 — Data & Personalization | `langflow/level-2-data-personalization.json` | 14 / 14 | Struktur diperiksa, belum diuji; butuh konfigurasi Astra DB |
| Level 3 — Action & Automation | `langflow/level-3-action-automation.json` | 30 / 36 | Struktur diperiksa, belum diuji; butuh konfigurasi Composio |

Ketiga flow dibuat untuk Langflow 1.11.5 dengan IBM watsonx.ai dan IBM Granite sebagai model. Nama model Granite dan semua kredensial tidak ditulis di file flow dan harus dipilih atau diisi lewat antarmuka Langflow. Belum ada flow yang terbukti berhasil di-import; perbarui kolom status setelah pengujian.

Ketiga flow tidak saling memanggil lewat Langflow. Level 2 dan Level 3 menerima konteks sebagai teks yang dimasukkan pengguna, bukan sebagai keluaran otomatis dari flow lain.

## Level 1 — `level-1-careerbridge-main.json`

**Tujuan.** Menganalisis profil pengguna terhadap target role dan job description, lalu menyusun rencana latihan empat minggu dari skill gap yang ditemukan.

**Alur.**

```text
User Profile Input
        |
        +--> Career Analyzer Prompt --> Career Analyzer (IBM Granite) --> Career Analysis JSON (output 1)
        |                                        |
        +----------------------------------------+--> Training Planner Prompt --> Training Planner (IBM Granite) --> 4-Week Training Plan JSON (output 2)
```

Training Planner menerima dua masukan: hasil analisis dari Granite pertama dan profil asli dari Chat Input. Profil dipakai untuk personalisasi, sedangkan skill gap hanya diambil dari hasil analisis.

**Input.** Satu Chat Input berisi satu objek JSON dengan tujuh kunci. Contoh lengkap ada di `sample-input/career-profile.json`.

| Kunci | Isi |
|---|---|
| `profile` | ringkasan diri |
| `education` | pendidikan dan mata kuliah |
| `skills` | daftar skill |
| `projects` | daftar proyek beserta deskripsi |
| `certifications` | daftar sertifikasi |
| `target_role` | peran yang dituju |
| `job_description` | deskripsi pekerjaan yang dituju |

**Output 1 — Career Analysis JSON.**

```text
status                "ok" atau "insufficient evidence"
input_flags[]         nama bagian input yang kosong atau tidak jelas
target_role
career_summary
detected_skills[]
matched_skills[]      { skill, evidence, source_section }
skill_gaps[]          { skill, reason, evidence, priority: High | Medium | Low }
recommendations[]
validation_questions[]
uncertainty_note
responsible_ai_note
```

**Output 2 — 4-Week Training Plan JSON.**

```text
status                "ok" atau "insufficient evidence"
target_role
priority_gaps[]       { skill, priority }
training_plan[4]      { week, focus, goal, actions[], practice, deliverable,
                        portfolio_evidence, estimated_time }
validation_note
```

**Perilaku yang diharapkan.** Setiap `evidence` merujuk isi input beserta bagian asalnya. Planner tidak menambah skill gap baru di luar hasil analisis, mengurutkan gap dari High ke Low, dan selalu menghasilkan tepat empat objek minggu. Jika skill gap kosong atau status analisis `insufficient evidence`, field terkait diisi `insufficient evidence`.

**Node pada kanvas.** User Profile Input, Career Analyzer Prompt, Career Analyzer - IBM Granite, Career Analysis JSON, Training Planner Prompt, Training Planner - IBM Granite, dan 4-Week Training Plan JSON.

**Konfigurasi wajib di Langflow (NEEDS_CONFIGURATION).** Pada kedua node Language Model: pilih provider IBM watsonx.ai, pilih model Granite, isi Project ID, endpoint, dan API key. Semua field ini kosong di file.

**Batasan yang diketahui.**
- Max Tokens bernilai `0` (bawaan komponen). Rencana empat minggu cukup panjang, jadi periksa apakah keluaran terpotong.
- Planner membaca teks keluaran Analyzer. Jika Granite menambahkan teks di luar JSON, Planner diminta mengambil objek JSON-nya saja, tetapi kepatuhan ini hanya bisa dinilai lewat uji jalan.
- Karena hanya ada satu Chat Input, profil harus ditempel sebagai satu JSON, bukan tujuh kolom terpisah.
- Planner tidak bisa diuji sendirian; setiap uji menjalankan Analyzer terlebih dahulu.

## Level 2 — `level-2-data-personalization.json`

**Tujuan.** Membaca riwayat pengguna dari Astra DB, membandingkannya dengan data terbaru, menghasilkan analisis progres, lalu menyimpan hasilnya.

**Alur.** Empat node Astra DB Data API (operasi Find) membaca `user_profile`, `career_history`, `skill_progress`, dan `training_progress`. Masing-masing diubah menjadi teks oleh node Parser (mode Stringify), digabung dengan data terbaru dari Chat Input pada satu Prompt Template, dianalisis oleh IBM Granite, dirapikan oleh Structured Output, lalu disimpan lewat node Astra DB dan ditampilkan lewat Chat Output.

**Output.**

```text
user_id
progress_summary
new_skills[]
strengthened_skills[]
unchanged_skills[]
new_skill_gaps[]
resolved_skill_gaps[]
new_evidence[]
next_development_focus[]
```

**Konfigurasi wajib (NEEDS_CONFIGURATION).**
- Database dan collection Astra DB, dengan nilai token diambil dari variabel `ASTRA_DB_APPLICATION_TOKEN`.
- Filter `{"user_id": "NEEDS_CONFIGURATION"}` pada keempat node Find harus diganti dengan `user_id` yang sebenarnya.
- Embedding atau vectorize pada node Astra DB yang menyimpan hasil.
- IBM watsonx.ai, model Granite, dan kredensial pada node Granite dan Structured Output.

**Batasan yang diketahui.**
- Tahap tulis berupa insert, bukan update. Setiap analisis menjadi dokumen baru pada collection `career_history`, sehingga riwayat menumpuk.
- `skill_progress` dan `training_progress` hanya dibaca. Tidak ada flow yang menulisnya, jadi kedua collection harus diisi manual.
- `analysis_id` dan `created_at` belum dihasilkan karena tidak ada komponen di export yang membuatnya.
- Structured Output memanggil model kedua kali, sehingga satu eksekusi memakai dua panggilan model.
- Cara node Astra DB menyimpan record dan kebutuhan embedding-nya belum terverifikasi.

## Level 3 — `level-3-action-automation.json`

**Tujuan.** Mengubah konteks karier menjadi aksi: pengingat belajar, event kalender, konten CV, pencarian resource, atau learning action.

**Alur.** Chat Input dan node Current Date (zona waktu `Asia/Jakarta`) masuk ke Action Planner Prompt, lalu IBM Granite, lalu Structured Output menghasilkan rencana aksi. Empat router If-Else berantai membaca `action_type` dan memilih cabang.

| `action_type` | Cabang |
|---|---|
| `calendar_event` | Human Approval, lalu payload event yang disetujui (Approve) atau output penolakan (Reject) |
| `cv_generation` | Granite menghasilkan konten CV/portofolio terstruktur |
| `resource_search` | Web Search, lalu Granite memilih resource dari hasil pencarian |
| `reminder` | Payload JSON `learning_reminder` (skill, task, duration_minutes) |
| `learning_action` | Bawaan; Granite menyusun satu learning action konkret |

**Rencana aksi.**

```text
action_type, skill, task, learning_goal, current_level,
duration_minutes (int), schedule (ISO 8601 atau insufficient evidence), rationale
```

**Output CV.** `professional_summary`, `skills_section[]`, `project_descriptions[]`, `achievement_highlights[]`, `portfolio_suggestions[]`, `missing_evidence[]`, `validation_note`.

**Output resource.** `skill`, `learning_goal`, `resources[]` (`title`, `type`, `reason`, `url`), `validation_note`. URL hanya boleh disalin dari hasil pencarian; field `url` ditambahkan di luar skema awal agar URL nyata tidak hilang.

**Konfigurasi wajib (NEEDS_CONFIGURATION).**
- IBM watsonx.ai, model Granite, dan kredensial pada semua node Granite dan Structured Output.
- Node Composio Google Calendar belum terhubung. Akun dan aksi harus dipilih di antarmuka Langflow, dengan kunci dari variabel `COMPOSIO_API_KEY`.

**Batasan yang diketahui.**
- Tidak ada komponen Timer bawaan. Pengingat berupa payload JSON, bukan timer yang berjalan.
- Cabang kalender berhenti pada payload yang disetujui. Pembuatan event nyata baru terjadi setelah payload disambungkan ke node Composio.
- Ada enam Chat Output, satu per cabang, karena Chat Output tidak menerima banyak cabang sekaligus. Hanya cabang yang aktif menghasilkan keluaran.
- Mode Human Approval perlu diperiksa perilakunya di Playground Langflow 1.11.5.
- Web Search memakai DuckDuckGo tanpa API key; kestabilannya dari lingkungan pengguna belum diuji.
- Satu eksekusi memakai dua sampai tiga panggilan model, tergantung cabang.

## Kompatibilitas

Semua flow mengikuti struktur export Langflow 1.11.5. Komponen Chat Input, Prompt Template, Language Model, dan Chat Output berasal langsung dari export yang tersedia. Komponen Astra DB, Structured Output, Parser, If-Else, Human Input, Web Search, Current Date, dan Composio Google Calendar dibangkitkan dari kode sumber paket `lfx` 1.11.5 dan bundel `lfx-datastax` / `lfx-bundles`, bukan dari export. Karena itu, kesesuaian keduanya baru terbukti setelah import berhasil di Langflow.
