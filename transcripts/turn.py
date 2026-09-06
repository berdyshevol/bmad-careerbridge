#!/usr/bin/env python3
"""Drive one turn of a headless Claude Code session running BMAD skills, and log it.

Usage:
  turn.py <step> <prompt-file> [--new]
    <step>         e.g. 01-brief  (transcripts/<step>/ is created)
    <prompt-file>  file with the user's message for this turn
    --new          start a fresh session (otherwise resumes transcripts/<step>/session.id)

Writes:
  transcripts/<step>/NN-user.md, NN-agent.md, dialogue.md (append), session.id, NN-raw.json
Prints the agent's reply.
"""
import json, os, subprocess, sys, datetime, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TR = pathlib.Path(__file__).resolve().parent

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    step, prompt_file = sys.argv[1], sys.argv[2]
    new = "--new" in sys.argv
    d = TR / step; d.mkdir(parents=True, exist_ok=True)
    prompt = pathlib.Path(prompt_file).read_text()
    sid_file = d / "session.id"
    n = len(list(d.glob("*-user.md"))) + 1
    tag = f"{n:02d}"

    cmd = ["claude", "-p", prompt, "--output-format", "json",
           "--model", os.environ.get("BMAD_MODEL", "claude-sonnet-5"),  # default Sonnet (economy mode); override per turn with BMAD_MODEL=claude-opus-5
           "--permission-mode", "acceptEdits",
           "--allowedTools",
           "Bash(uv run:*) Bash(ls:*) Bash(cat:*) Bash(mkdir:*) Bash(find:*) Bash(wc:*) Bash(head:*) Bash(tail:*) "
           "Read Write Edit Glob Grep Skill WebSearch WebFetch Task TodoWrite"]
    if not new and sid_file.exists():
        cmd += ["--resume", sid_file.read_text().strip()]
    env = {k: v for k, v in os.environ.items() if k not in ("CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT")}
    t0 = datetime.datetime.now()
    proc = subprocess.run(cmd, cwd=ROOT, env=env, capture_output=True, text=True)
    dt = (datetime.datetime.now() - t0).total_seconds()
    raw = proc.stdout
    (d / f"{tag}-raw.json").write_text(raw)
    try:
        data = json.loads(raw)
    except Exception:
        print("!! could not parse JSON; stderr:\n", proc.stderr[:2000]); print(raw[:2000]); sys.exit(2)
    items = data if isinstance(data, list) else [data]
    result = next((x for x in items if x.get("type") == "result"), None)
    if result is None:
        print("!! no result item; stderr:\n", proc.stderr[:2000]); sys.exit(3)
    sid = result.get("session_id"); reply = result.get("result", "")
    usage = result.get("usage", {}); cost = result.get("total_cost_usd"); turns = result.get("num_turns")
    if sid: sid_file.write_text(sid)
    (d / f"{tag}-user.md").write_text(prompt)
    (d / f"{tag}-agent.md").write_text(reply)
    meta = f"\n\n<!-- turn {tag} · {t0:%Y-%m-%d %H:%M} · {dt:.0f}s · agent turns {turns} · in {usage.get('input_tokens')} + cache {usage.get('cache_read_input_tokens')} / out {usage.get('output_tokens')} tok · ${cost} -->\n"
    with (d / "dialogue.md").open("a") as f:
        f.write(f"\n\n## Turn {tag} — Oleg\n\n{prompt}\n\n## Turn {tag} — Agent\n\n{reply}{meta}")
    print(reply)
    print(f"\n--- {dt:.0f}s · agent turns {turns} · ${cost} · session {sid}", file=sys.stderr)

if __name__ == "__main__":
    main()
