# Daily QA job search

Runs every day at **8:00 AM IST** via GitHub Actions (`.github/workflows/daily-job-search.yml`).

- 👉 **[JOBS.md](JOBS.md)**: every job found so far, grouped by status, sorted by match score
- [reports/](reports/): one report per day
- `tracker.json`: machine-readable list (edit `status` to `applied` / `rejected` / `awaiting_approval` after you act on a job)
- `prompt.md`: the agent's instructions · `resume.md`: resume used for matching

Run it manually: **Actions → Daily job search → Run workflow**.
