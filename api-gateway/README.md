### E-commerce API Gateway (Express, Redis, Mongo/Mongoose)

Features
- API key and JWT auth, role-based ACL per service
- Rate limiting (Redis), response caching (Redis)
- Dynamic service registry (Mongo), health checks
- Proxy routing: `/svc/:service/...`
- Metrics (Prometheus at `/metrics`), health at `/health`
- Admin APIs: manage services and API keys under `/admin` (requires `x-admin-key`)

Quick start (with Docker)
- Copy `.env.example` to `.env` and update values if needed
- Build and run: `docker compose up --build`
- Seed data locally (without Docker): `npm run seed`

Local run
- Requirements: Node 18+, MongoDB, Redis
- Install: `npm i`
- Start: `npm start`

Admin API
- List services: `GET /admin/services`
- Add service: `POST /admin/services` JSON: `{ name, baseUrl, version?, healthPath?, weight?, enabled? }`
- Create API key: `POST /admin/apikeys` JSON: `{ name, roles? }` -> returns `apiKey`
- All admin endpoints require header: `x-admin-key: <ADMIN_API_KEYS>`

Gateway usage
- Require header: `x-api-key: <client-key>`
- Proxy example: `GET /svc/products/v1/items?limit=10`
- Authorization: GET/HEAD require `read` role; write methods require `write` (configurable in `src/config/acl.js`)

Metrics
- Prometheus scrape: `GET /metrics`

Notes
- Configure ACL in `src/config/acl.js`
- Configure rate limits via env vars
- Caching applies to GET requests and is namespaced per API key