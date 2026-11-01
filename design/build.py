"""Build the static site from a design template.

Usage: python3 design/build.py v20
The template's <!--LOGO-->, <!--DEFS--> and <!--LD--> markers are filled from design/parts/.
Blocks inside <main> start with <!--@home websites ...--> and are copied to the pages listed
there, so one template yields the home page and one page per service. FAQ entries carry
data-on="..." with the same page names. Links to sections that are not on a page point to /#id.
"""
import os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = os.path.join(root, 'design')
name = sys.argv[1] if len(sys.argv) > 1 else 'v20'
t = open(os.path.join(d, name + '-template.html')).read()
part = lambda f: open(os.path.join(d, 'parts', f)).read()
t = t.replace('<!--LOGO-->', part('logo.svg')).replace('<!--DEFS-->', part('disc-symbol.svg')).replace('<!--LD-->', part('schema.html'))
out = os.path.join(root, 'public', 'site')

if '<!--@' not in t:  # older single-page templates
    open(os.path.join(out, 'index.html'), 'w').write(t)
    print(name, len(t), 'bytes'); sys.exit()

pages = {
    'home': ('index.html', '/', None, None),
    'websites': ('websites.html', '/websites', 'Websites ab 300 € · FOAV München',
                 'Websites für Restaurants, Läden, Handwerk und Ferienwohnungen: Basis mit 3 Seiten ab 300 €, fertig in bis zu 7 Tagen. Festpreis vor dem Start, persönlich aus München.'),
    'roomtours': ('roomtours.html', '/roomtours', 'KI-Roomtours ab 300 € · FOAV München',
                  'Video-Rundgang aus Ihren Handyfotos für Airbnb, Booking.com und Ihre Website. 300 € bis 150 m², fertig in bis zu 48 Stunden, ohne Fototermin.'),
    'nfc-platten': ('nfc-platten.html', '/nfc-platten', 'NFC-Platten für Google-Bewertungen · 15 € · FOAV',
                    'NFC-Platten für mehr Google-Bewertungen: Gast hält das Handy an die Platte, die Bewertungsseite öffnet sich. 15 € pro Stück, Weiß oder Schwarz, ohne App.'),
}
a = t.index('<main id="start">') + len('<main id="start">'); b = t.index('</main>')
head, main, tail = t[:a], t[a:b], t[b:]
blocks = re.findall(r'<!--@([^>]*)-->\n(.*?)(?=\n<!--@|\Z)', main, re.S)

for key, (fname, path, title, desc) in pages.items():
    body = '\n\n'.join(html for on, html in blocks if key in on.split())
    # FAQ: keep only the entries for this page
    body = re.sub(r'\s*<details data-on="([^"]*)">.*?</details>', lambda m: m.group(0) if key in m.group(1).split() else '', body, flags=re.S)
    page = head + '\n' + body + '\n' + tail
    if title:
        page = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', page, count=1)
        page = re.sub(r'(<meta property="og:title" content=")[^"]*', r'\g<1>' + title, page, count=1)
        page = re.sub(r'(<meta name="description" content=")[^"]*', r'\g<1>' + desc, page, count=1)
        page = re.sub(r'(<meta property="og:description" content=")[^"]*', r'\g<1>' + desc, page, count=1)
        page = page.replace('<link rel="canonical" href="https://foav.de/">', f'<link rel="canonical" href="https://foav.de{path}">')
        page = page.replace('<meta property="og:url" content="https://foav.de/">', f'<meta property="og:url" content="https://foav.de{path}">')
        # the service page does not link to itself
        page = re.sub(r'<a class="more" href="%s">.*?</a>\s*' % re.escape(path), '', page, flags=re.S)
    ids = set(re.findall(r'\sid="([^"]+)"', page))
    page = re.sub(r'href="#([\w-]+)"', lambda m: m.group(0) if m.group(1) in ids else f'href="/#{m.group(1)}"', page)
    # on the home page, links to its own sections stay in-page
    if key == 'home':
        page = re.sub(r'href="/#([\w-]+)"', lambda m: f'href="#{m.group(1)}"' if m.group(1) in ids else m.group(0), page)
    open(os.path.join(out, fname), 'w').write(page)
    print(name, fname, len(page), 'bytes')
