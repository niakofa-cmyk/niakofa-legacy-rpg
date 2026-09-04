# Niakofa Legacy RPG

Standalone Niakofa Legacy RPG runtime. The current validation slice boots Kwame inside the Mensah Compound with PixiJS, environment assets, movement, collision, NPC interaction, fishing, animation, and local save/resume.

## Run

```bash
pnpm install
pnpm --filter @niakofa/legacy-rpg typecheck
pnpm --filter @niakofa/legacy-rpg build
pnpm --filter @niakofa/legacy-rpg dev
```

The development server uses port 5174.

## Production launch bridge

For a separately hosted RPG, configure the platform API origin at build time:

```bash
VITE_NIAKOFA_API_ORIGIN=https://<production-niakofa-origin>
```

The live launch flow is:

1. The authenticated Niakofa platform issues a short-lived, one-use opaque ticket.
2. The browser navigates to the RPG with `?ticket=...`.
3. The RPG immediately exchanges the ticket at `${VITE_NIAKOFA_API_ORIGIN}/api/legacy/launch-context`.
4. The ticket is removed from the browser URL before the exchange completes.
5. The exchange uses no platform session cookie and receives only the narrow Legacy context.

For separate origins, the platform production `ALLOWED_ORIGIN` must include the exact RPG origin. If the RPG is reverse-proxied under the platform origin, omit `VITE_NIAKOFA_API_ORIGIN` and same-origin `/api` is used.

Never place a session token, family biography, or other platform credential in the RPG URL or client bundle.
