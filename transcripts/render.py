#!/usr/bin/env python3
"""Render one saved turn (user prompt + agent reply) in the terminal, Claude-Code style, for screenshots.

Usage: render.py <step> <turn NN> [--user-lines N] [--agent-chars N] [--skip-agent-lines N]
"""
import sys, time, pathlib, argparse
from rich.console import Console
from rich.markdown import Markdown
from rich.text import Text
from rich.panel import Panel

TR = pathlib.Path(__file__).resolve().parent

ap = argparse.ArgumentParser()
ap.add_argument("step"); ap.add_argument("turn")
ap.add_argument("--user-lines", type=int, default=6)
ap.add_argument("--agent-chars", type=int, default=2200)
ap.add_argument("--skip-agent-chars", type=int, default=0)
ap.add_argument("--agent-from", default=None, help="start agent text at this substring")
ap.add_argument("--agent-to", default=None, help="end agent text before this substring")
ap.add_argument("--title", default="BMAD agent")
a = ap.parse_args()

d = TR / a.step
user = (d / f"{a.turn}-user.md").read_text().strip().splitlines()
agent = (d / f"{a.turn}-agent.md").read_text().strip()

time.sleep(0.4)
sys.stdout.write("\033[2J\033[3J\033[H"); sys.stdout.flush()
c = Console(highlight=False, soft_wrap=False)

# prompt line
first = user[0] if user else ""
rest = user[1:]
if first.startswith("/"):
    c.print(Text("❯ ", style="bold green") + Text(first, style="bold"))
else:
    c.print(Text("❯ ", style="bold green") + Text("(Oleg)", style="bold"))
    rest = user
shown = [l for l in rest if l.strip()][: a.user_lines]
for l in shown:
    l = l.replace("**", "").replace("`", "")
    l = l if len(l) <= 118 else l[:115].rstrip() + "…"
    c.print(Text("  " + l, style="grey50"))
if len([l for l in rest if l.strip()]) > a.user_lines:
    c.print(Text("  …", style="grey50"))
c.print()

start = a.skip_agent_chars
if a.agent_from and a.agent_from in agent:
    start = agent.index(a.agent_from)
end = len(agent)
if a.agent_to and a.agent_to in agent[start:]:
    end = start + agent[start:].index(a.agent_to)
body = agent[start:end]
cut = False
if len(body) > a.agent_chars:
    cut_at = body.rfind("\n\n", 0, a.agent_chars)
    body = body[: cut_at if cut_at > 200 else a.agent_chars]; cut = True
prefix = "…\n\n" if start > 0 else ""
suffix = "\n\n…" if (cut or end < len(agent)) else ""
c.print(Panel(Markdown(prefix + body.strip() + suffix), title=f"[bold]{a.title}[/bold]", title_align="left", border_style="green", padding=(1, 2)))
sys.stdout.flush()
