#!/usr/bin/env python3
"""Render the head of a markdown file in the terminal (for screenshots). Usage: renderfile.py <path> [--chars N] [--from TEXT] [--title T]"""
import sys, time, argparse, pathlib
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.text import Text
ap = argparse.ArgumentParser(); ap.add_argument("path"); ap.add_argument("--chars", type=int, default=2200)
ap.add_argument("--from", dest="frm", default=None); ap.add_argument("--title", default=None)
a = ap.parse_args()
p = pathlib.Path(a.path); txt = p.read_text()
if txt.startswith("---"):
    end = txt.find("\n---", 3); txt = txt[end+4:] if end > 0 else txt
start = txt.index(a.frm) if a.frm and a.frm in txt else 0
body = txt[start:]
cut = len(body) > a.chars
if cut:
    at = body.rfind("\n\n", 0, a.chars); body = body[: at if at > 200 else a.chars]
time.sleep(0.4); sys.stdout.write("\033[2J\033[3J\033[H"); sys.stdout.flush()
c = Console(highlight=False)
title = a.title or str(p).split("_bmad-output/")[-1]
c.print(Text("❯ ", style="bold green") + Text(f"cat {title}", style="bold"))
c.print()
c.print(Panel(Markdown(("…\n\n" if start else "") + body.strip() + ("\n\n…" if cut else "")), title=f"[bold]{title}[/bold]", title_align="left", border_style="cyan", padding=(1, 2)))
