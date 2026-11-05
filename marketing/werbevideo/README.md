# FOAV-Werbevideo (9:16, 25 s)

Ergebnis: `../FOAV-Werbevideo-9x16.mp4`. Aus eigenem Material (Roomtour-Beispiel, SPIRULI, NFC-Platte), ohne Ton.

Neu erzeugen (Playwright + ffmpeg):

    mkdir -p fr && node render.js full fr
    ffmpeg -framerate 30 -i fr/f%04d.jpg -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart ../FOAV-Werbevideo-9x16.mp4

Texte und Zeiten stehen in `ad.html` (`S` = Szenen-Zeiten, `render(t)`).
