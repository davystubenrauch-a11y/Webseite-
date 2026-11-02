"""Build public/site/index.html from a design template.

Usage: python3 design/build.py v13
The template's <!--LOGO-->, <!--DEFS--> and <!--LD--> markers are filled from design/parts/.
"""
import os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = os.path.join(root, 'design')
name = sys.argv[1] if len(sys.argv) > 1 else 'v13'
t = open(os.path.join(d, name + '-template.html')).read()
part = lambda f: open(os.path.join(d, 'parts', f)).read()
t = t.replace('<!--LOGO-->', part('logo.svg')).replace('<!--DEFS-->', part('disc-symbol.svg')).replace('<!--LD-->', part('schema.html'))
open(os.path.join(root, 'public', 'site', 'index.html'), 'w').write(t)
print(name, len(t), 'bytes')
