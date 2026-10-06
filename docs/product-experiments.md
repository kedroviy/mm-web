# Admin analytics notes (mm-web)

Канон продуктовых экспериментов матча: `../first-mm-server/movie-match/docs/product-experiments.md`

## Shipped (2026-10-06) — users overview + match funnel

### Users (`/dashboard/users`)

- Сводка: total / new / returning / DAU avg / WAU → `GET /analytics/users-overview`
- Фильтры списка: lifecycle (`all|new|returning`), last login from/to, username, email → `GET /nsi-users/users`
- В DTO добавлен `createdAt` (legacy backfill из `lastLoginAt`)

### Match funnel (`/dashboard/analytics/match-funnel`)

- Воронка: create → join≥2 → start → shortlist → result
- Разрез: web / mobile / unknown (по `platform` автора комнаты)
- API: `GET /analytics/match-funnel`
- Данные пишутся в `analytics_room_funnel` (переживает 24h cleanup комнат)

### Важно

- Историческая воронка начинается **после деплоя** (старые комнаты не ретро-снимятся).
- Mobile channel заполняется, если RN логин шлёт `platform: ios|android|mobile`.
