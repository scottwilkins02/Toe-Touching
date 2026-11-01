"""Builds index.html from src/app.html + src/figures.js + src/startup.html. Run: python3 src/build.py"""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
src = (root / 'src/app.html').read_text()
out = src.replace('/*FIGURES*/', (root / 'src/figures.js').read_text()).replace('<!--STARTUP-->', (root / 'src/startup.html').read_text())
(root / 'index.html').write_text(out)
print('built index.html', len(out), 'bytes')
