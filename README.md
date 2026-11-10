# Hollyend Learning

Practice quizzes, spelling tests, a revision library, characters, a shop and a pocket-money bank for Millie (Year 5) and Kristan (Year 8).

## How it fits together
- **Site**: plain static files, hosted on Vercel from this repo. Every push to `main` goes live.
  - `src/page.html` is built by `python3 src/build.py` into two pages:
    - `/learning/index.html` – the Learning app (children land here; old `/` links forward here)
    - `/index.html` – the Hollyend home: the parents' dashboard (Family overview + Kristan's Health summary). Children who open `/` are sent to `/learning/`.
  - Deep links into Learning: `/learning/#millie-homework`, `#kristan-bank`, `#kristan-progress`, `#calendar`
  - `themes.js` also holds Millie's jungle animals (`CRITTER_SVG`, `CRITTERS`, `PEEK`)
  - `engine.js` – questions, Millie's weekly spelling list, revision library (updated weekly)
  - `words.js` – word banks (built from `src/words/*.js`): challenge words for both, Kristan's English words and French bank, with spaced-repetition picking. Add words to `src/words/`, run `python3 src/build.py`, then `node tests/words.test.js` (fails on duplicates)
  - `journey.js`, `league.js` – Millie's space journey and Kristan's league
  - `progress.js` – comebacks, points, ranks, badges
  - `avatar.js` – characters, shop items, bank rules
  - `supa-adapter.js` – Supabase sign-in and storage
- **Database**: Supabase project `hollyend` (tables `members`, `attempts`, `purchases`, `profiles`, `bank`). Row-level security: each child can only save their own results, nobody can overspend, the bank enforces 500 points = £1 and a £3 weekly cap, and only the parent login can mark cash-outs as paid.
- **Logins**: `millie@hollyend.com`, `kristan@hollyend.com`, `dad@hollyend.com` (parent; `mum@hollyend.com` also works as a parent login if created) (created in Supabase → Authentication; they're linked to the right role automatically).

The Supabase key in `supa-adapter.js` is the public "publishable" key and is safe to be here. Never commit the secret/service-role key.
