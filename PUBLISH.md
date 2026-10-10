# Publish to HarrisCrypto/ad-intelligence (own GitHub section)

## Why “All repositories” is not enough for *this* agent

Your Cursor GitHub App may have access to **all** repos, but **this Cloud Agent run** was started only against:

`HarrisCrypto/Union-Jack-Rebuild-`

Its install token only includes that repo. Pushing to `ad-intelligence` fails with:

`Permission to HarrisCrypto/ad-intelligence.git denied to cursor[bot]`

You must either start an agent **on** `ad-intelligence`, or push from your own machine.

---

## Option A — new Cloud Agent on the new repo (recommended)

1. Open [cursor.com/agents](https://cursor.com/agents) → **New agent**
2. Select repository: **`HarrisCrypto/ad-intelligence`**
3. Paste this prompt:

```text
This repo is empty. Publish the Ad Intelligence skill as the repo root.

1. Clone or fetch from https://github.com/HarrisCrypto/Union-Jack-Rebuild-
   branch cursor/ad-intelligence-skill-3683
2. Copy the contents of the `ad-intelligence/` folder to THIS repo root
   (so `.cursor-plugin/`, `skills/`, `README.md`, `INSTALL.md` are at root)
3. Commit and push to main
4. Confirm https://github.com/HarrisCrypto/ad-intelligence shows the files
```

4. After it’s live, tell the Union Jack agent to **remove** `ad-intelligence/` from Union Jack.

---

## Option B — add repo to environment, then new agent

1. Open the environment:  
   https://cursor.com/dashboard/cloud-agents/environments/e/ac36468b-a743-11f1-a7d1-d6b4613131ce  
2. Add `github.com/HarrisCrypto/ad-intelligence` to the environment repos  
3. Start a **new** agent from that environment (this running agent won’t pick up new repos)

---

## Option C — push yourself (fastest if you have `gh` locally)

```bash
git clone -b cursor/ad-intelligence-skill-3683 https://github.com/HarrisCrypto/Union-Jack-Rebuild-.git
cd Union-Jack-Rebuild-/ad-intelligence
git init -b main
git add -A
git commit -m "Initial commit: Ad Intelligence v3 one-stop ad maker"
gh repo create HarrisCrypto/ad-intelligence --public --source=. --remote=origin --push
# if repo already exists empty:
git remote add origin https://github.com/HarrisCrypto/ad-intelligence.git
git push -u origin main
```

---

## After it’s published

Cursor install: **Customize → From GitHub Repository →**  
`https://github.com/HarrisCrypto/ad-intelligence`

Then strip `ad-intelligence/` out of Union Jack so the site repo stays clean.
