# Sicherheit — wirsingendann.de

Audit-Stand: Mai 2026 · Fun-Projekt mit bewusst einfachen Trade-offs.

## ✅ Gut abgesichert

| Bereich | Maßnahme |
|--------|----------|
| **XSS (Stored)** | `sanitizeText`, React-Escape, Spotify-URLs nur HTTPS + Allowlist |
| **Clickjacking** | `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'` |
| **MIME-Sniffing** | `X-Content-Type-Options: nosniff` |
| **Headers (Prod)** | CSP, HSTS, `Referrer-Policy`, kein `X-Powered-By` |
| **API-Spam** | Rate-Limits (Songs, Votes, Admin-Login, Admin-Delete) |
| **Inputs** | UUID-Format, JSON max. 4 KB, Song-/Vote-Limits |
| **Admin** | httpOnly-Cookie, HMAC-Session, `timingSafeEqual`, SameSite=strict |
| **Persistenz** | Atomares Schreiben (`write` + `rename`) |
| **Docker** | Prozess als Non-Root-User `app` |

## ⚠️ Bekannte Risiken (akzeptiert / mitigiert)

### Mittel

| Risiko | Details | Empfehlung |
|--------|---------|------------|
| **Vote-Manipulation** | `voterId` kommt aus LocalStorage, beliebig erzeugbar | Für Fun-OK; Rate-Limits + max. 50 Votes/Voter. Kein Hochsicherheits-Voting. |
| **Rate-Limits im RAM** | Pro Instanz, nicht clusterweit | Global: Cloudflare/nginx Rate-Limit |
| **IP-Spoofing** | `X-Forwarded-For` nur bei `TRUST_PROXY=true` | In Production hinter Proxy `TRUST_PROXY=true` setzen |
| **Admin-Passwort** | Plaintext-Vergleich in Env, kein bcrypt | Starkes Passwort, separates `ADMIN_SECRET`, nie committen |
| **Session = Passwort** | Ohne `ADMIN_SECRET` wird `ADMIN_PASSWORD` zum Signatur-Key | Immer eigenes `ADMIN_SECRET` in Production |
| **JSON-Store** | Keine DB-Transaktionen; theoretisch Race bei extremer Last | Für erwartete Last ausreichend (atomares Write) |
| **CSP `unsafe-inline`** | Next.js benötigt das für Styles/Scripts in Prod | Standard bei Next; kein user-generated HTML |

### Niedrig

| Risiko | Details |
|--------|---------|
| **Admin-Endpunkt sichtbar** | `/admin`, `/api/admin/me` → erkennbar, dass Admin existiert |
| **Kein CAPTCHA** | Bots können innerhalb der Limits voten/eintragen |
| **Twitch Fallback** | decapi.me als Drittanbieter (kein Secret nötig) |
| **npm audit** | Moderate Advisory in transitive `postcss` (Next-Bundle) — Build-Tool, kein Runtime-User-CSS |

## 🔧 Production-Checkliste

- [ ] `ADMIN_PASSWORD` + separates **`ADMIN_SECRET`** (lang, zufällig)
- [ ] `TRUST_PROXY=true` nur wenn Reverse-Proxy Client-IP setzt
- [ ] TLS am Proxy, HSTS greift automatisch in Production
- [ ] Volume `data/` mit restriktiven Rechten
- [ ] Secrets nur als Env, nicht im Image
- [ ] Regelmäßig `npm audit` / Next.js Updates

## API-Schutzübersicht

| Route | Auth | Rate-Limit |
|-------|------|------------|
| `POST /api/songs` | — | 8/h pro IP-Key |
| `POST /api/songs/[id]/vote` | — | 40/min |
| `POST /api/admin/login` | Passwort | 5/15 min |
| `DELETE /api/songs/[id]` | Admin-Cookie | 30/min |
| `GET/PATCH /api/admin/settings` | Admin-Cookie | PATCH: 20/min |
| `GET /api/*` | — | — (read-only) |

**Simulation:** Nur per Admin (`data/settings.json`). Öffentlich sichtbar als `followerSimulated` in `/api/stats` — kein Privilegien-Escalation.
