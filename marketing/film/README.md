# FOAV-Film (16:9, 25,6 s) im Stil einer Produkt-Vorstellung

Ergebnis: `../FOAV-Film-16x9.mp4`. Verlaufs-Schrift mit Glasrippen, schwebende Kacheln mit Tiefenunschärfe,
Eingabeleiste mit Mauszeiger, Kamerafahrt über Kacheln, echte Bewegungsunschärfe.

    mkdir fr && node render.js full fr 90          # 90 Bilder/s
    python3 music.py musik.wav
    ffmpeg -framerate 90 -i fr/f%05d.jpg -i musik.wav -vf "tmix=frames=3:weights='1 1 1',fps=30" \
      -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -shortest ../FOAV-Film-16x9.mp4

Szenen und Zeiten: `S` in `film.html`. Musik und Effekte selbst erzeugt (keine fremden Rechte).
