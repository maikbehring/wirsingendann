# Sicherheit — wirsingendann.de

Audit-Stand: Mai 2026 · Fun-Projekt mit bewusst einfachen Trade-offs.

## ✅ Gut abgesichert

| Bereich | Maßnahme |
|--------|----------|
| **XSS (Stored)** | `sanitizeText`, React-Escape, Spotify-URLs nur HTTPS + Allowlist |
| **Clickjacking** | `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'` |
| **MIME-Sniffing** | `X-Content-Type-Options: nosniff` |
| **Headers (Prod)** | CSP, HSTS, `Referrer-Policy`, kein `X-Powered-By` |
| **Vote-Schutz** | Signiertes httpOnly-Cookie + IP-Key (1× pro Song) + **Friendly Captcha (EU)** |
| **API-Spam** | Rate-Limits (Songs, Votes, Admin-Login, Admin-Delete) |
| **Inputs** | UUID-Format, JSON max. 4 KB (Votes mit Captcha bis 20 KB), Song-/Vote-Limits |
| **Admin** | httpOnly-Cookie, HMAC-Session, `timingSafeEqual`, SameSite=strict |
| **Persistenz** | Atomares Schreiben (`write` + `rename`) |
| **Docker** | Prozess als Non-Root-User `app` |

## ⚠️ Bekannte Risiken (akzeptiert / mitigiert)

### Mittel

| Risiko | Details | Empfehlung |
|--------|---------|------------|
| **Vote-Bots** | httpOnly Voter-Cookie + 1 Vote/IP/Song (gehasht) | `TRUST_PROXY=true` in Production |
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
| **Song-Einträge ohne CAPTCHA** | Nur Votes sind durch Friendly Captcha geschützt |
| **Twitch Fallback** | decapi.me als Drittanbieter (kein Secret nötig) |
| **npm audit** | Moderate Advisory in transitive `postcss` (Next-Bundle) — Build-Tool, kein Runtime-User-CSS |

## 🔧 Production-Checkliste

- [ ] `ADMIN_PASSWORD` + separates **`ADMIN_SECRET`** (lang, zufällig)
- [ ] `TRUST_PROXY=true` nur wenn Reverse-Proxy Client-IP setzt
- [ ] `VOTER_SECRET` setzen (eigenes Random-Secret)
- [ ] `NEXT_PUBLIC_FRIENDLY_CAPTCHA_SITE_KEY` + `FRIENDLY_CAPTCHA_API_KEY` (Friendly Captcha EU)
- [ ] TLS am Proxy, HSTS greift automatisch in Production
- [ ] Volume `data/` mit restriktiven Rechten
- [ ] Secrets nur als Env, nicht im Image
- [ ] Regelmäßig `npm audit` / Next.js Updates

## API-Schutzübersicht

| Route | Auth | Rate-Limit |
|-------|------|------------|
| `POST /api/songs` | — | 8/h pro IP-Key |
| `POST /api/songs/[id]/vote` | Voter-Cookie + Friendly-Captcha-Token | 12/min pro IP-Key |
| `POST /api/admin/login` | Passwort | 5/15 min |
| `DELETE /api/songs/[id]` | Admin-Cookie | 30/min |
| `GET/PATCH /api/admin/settings` | Admin-Cookie | PATCH: 20/min |
| `GET /api/*` | — | — (read-only) |

**Simulation:** Nur per Admin (`data/settings.json`). Öffentlich sichtbar als `followerSimulated` in `/api/stats` — kein Privilegien-Escalation.
