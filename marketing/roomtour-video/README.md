# Roomtour-Werbevideo (9:16, 32 s)

Ergebnis: `../FOAV-Roomtour-Werbevideo-9x16.mp4` (ohne Ton).

    mkdir -p fr && node render.js full fr
    ffmpeg -framerate 30 -i fr/f%04d.jpg -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -movflags +faststart ../FOAV-Roomtour-Werbevideo-9x16.mp4

`ph/` = Handyfotos (p*) und KI-Look (a*) aus Standbildern des Beispielvideos.
