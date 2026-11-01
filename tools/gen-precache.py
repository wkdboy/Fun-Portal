"""Rebuilds precache.json: the list of files the service worker saves for offline use, plus a version
(a hash of their contents). Run after ANY change to site files:  python tools/gen-precache.py"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", "tools", ".claude", "docs"}
SKIP_FILES = {"precache.json", "sw.js", ".gitignore", ".nojekyll", "CLAUDE.md", "README.md", "plan.md", "questions.md"}

files = []
for p in sorted(ROOT.rglob("*")):
    rel = p.relative_to(ROOT)
    if not p.is_file() or rel.parts[0] in SKIP_DIRS or p.name in SKIP_FILES:
        continue
    files.append(rel.as_posix())

h = hashlib.sha256()
for f in files:
    h.update(f.encode())
    h.update((ROOT / f).read_bytes())
version = h.hexdigest()[:10]

log = json.loads((ROOT / "changelog.json").read_text(encoding="utf-8"))
app_version = log[0]["version"]  # newest entry is first; add one to changelog.json for every release

all_files = ["./"] + files + ["precache.json"]
out = {"version": version, "appVersion": app_version, "files": all_files}
(ROOT / "precache.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
print(f"precache.json: {len(all_files)} files, app v{app_version}, build {version}")
