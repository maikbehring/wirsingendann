# wirsingendann.de

Community-Songvote zum Mittwald-Stream **„Live aus dem Maschinenraum: Container Hosting & KI“** (28.05.2026, 14–17 Uhr auf [twitch.tv/mittwaldhosting](https://www.twitch.tv/mittwaldhosting)).

**Mission:** 100 Follower geschafft — *Angels* zu dritt gesungen. Nächstes Ziel: **250 Follower** = Auftritt mit Band im Maschinenraum-Stream. Diese Seite sammelt Songwünsche und Votes für die nächste Hitparade.

## Features

| Bereich | Beschreibung |
|--------|----------------|
| **Twitch-Mission** | Live-Follower-Zähler mit Fortschrittsbalken (Ziel: 250, Meilenstein 100) |
| **Songwünsche** | Titel (Pflicht) + optionaler Spotify-Link |
| **Hitparade** | Upvoting, eine Stimme pro Song und Browser |
| **Conversion-UI** | Klare CTAs, Dringlichkeit, 3-Schritte-Funnel, Sticky-Leiste (Mobile) |
| **Admin** | Login unter `/admin` — Songs löschen |
| **Impressum** | `/impressum` |
| **Sicherheit** | Rate-Limits, Input-Sanitizing, CSP, signierte Admin-Session — siehe `SECURITY.md` |

Keine Demo-Daten: Songs und Votes kommen nur von echten Nutzer:innen.

## Schnellstart

```bash
cd songvote
npm install
cp .env.example .env.local
npm run dev
```

Öffnen: **http://127.0.0.1:3000** (Dev-Server bindet fest an `127.0.0.1:3000`).

> Nur `npm install` und `npm run dev` ausführen — keinen Shell-Kommentar (`# …`) mitkopieren, sonst `npm error EINVALIDTAGNAME`.

### Fehler: `main.js` 404 / MIME `text/plain` / weiße Seite

Meist ein **kaputter `.next`-Cache** (z. B. nach `npm run build` während `dev` noch läuft). Fix:

```bash
# Alle Dev-Server stoppen (Ctrl+C), dann:
npm run dev:clean
```

Danach **http://127.0.0.1:3000** hart neu laden (Cmd+Shift+R). In Chrome: DevTools → Application → Service Workers → „Unregister“ (falls `/sw.js` von einem anderen Projekt cached).

**Nicht** `npm start` und `npm run dev` gleichzeitig nutzen.

## Umgebungsvariablen

Alle Variablen in `.env.local` (wird nicht committed). Vorlage: `.env.example`.

### Admin (Pflicht für `/admin`)

```bash
ADMIN_PASSWORD=dein-sicheres-passwort-min-8-zeichen
# Optional: separates Secret für Session-Signatur (sonst = ADMIN_PASSWORD)
ADMIN_SECRET=
```

Nach Änderung den Server neu starten.

### Twitch (optional)

```bash
TWITCH_CLIENT_ID=...
TWITCH_CLIENT_SECRET=...
TWITCH_CHANNEL=mittwaldhosting
```

Ohne Credentials: Follower-Zahl über öffentlichen Endpunkt (gecacht 5 Min.).

### Persistenz

```bash
DATA_DIR=./data
```

Songs und Votes liegen in `data/songs.json`.

## Admin

1. `ADMIN_PASSWORD` in `.env.local` setzen  
2. Server neu starten  
3. [http://127.0.0.1:3000/admin](http://127.0.0.1:3000/admin) öffnen  
4. Einloggen → Songs anzeigen und löschen (mit Bestätigung)

Link auch im Footer der Startseite.

## API (intern)

| Methode | Pfad | Beschreibung |
|--------|------|----------------|
| `GET` | `/api/stats` | Follower, Song-Anzahl, Votes |
| `GET` | `/api/songs` | Hitparade |
| `POST` | `/api/songs` | Song einreichen |
| `POST` | `/api/songs/[id]/vote` | Upvote |
| `DELETE` | `/api/songs/[id]` | Song löschen (nur Admin) |
| `POST` | `/api/admin/login` | Admin-Login |
| `POST` | `/api/admin/logout` | Admin-Logout |
| `GET` | `/api/admin/me` | Session-Status |

## Production / Container Hosting

```bash
npm run build
docker build -t wirsingendann .
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=... \
  -e TWITCH_CLIENT_ID=... \
  -e TWITCH_CLIENT_SECRET=... \
  -v songvote-data:/app/data \
  wirsingendann
```

- Next.js **standalone**-Output im Dockerfile  
- Volume auf `/app/data` für persistente `songs.json`  
- `ADMIN_PASSWORD` und Twitch-Keys als Umgebungsvariablen setzen, nicht ins Image bake’n

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, standalone)
- React 19
- Tailwind CSS 4
- JSON-Datei als Store (`data/songs.json`)

## Projektstruktur (Auszug)

```
app/
  page.tsx              # Startseite (Hitparade + Conversion)
  admin/page.tsx        # Admin-Panel
  impressum/page.tsx
  api/                  # REST-Endpoints
components/             # UI (Hero, Form, Hitparade, Admin, …)
lib/                    # Store, Twitch, Auth, Security
data/songs.json         # Persistenz (gitignored Inhalt bei Deploy)
```

## Lizenz / Hinweis

Privates Fun-Projekt von Maik Behring — Impressum auf der Website unter `/impressum`.
