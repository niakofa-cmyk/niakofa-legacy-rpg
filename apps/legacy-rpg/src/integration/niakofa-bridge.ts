import type { LegacyLaunchContext } from "@niakofa/shared-types";

/**
 * Mock-first launch context. Live launches use a one-time, short-lived ticket
 * issued by the platform. The RPG exchanges the ticket immediately and only
 * receives the narrow launch context; it never receives a raw session token.
 */
export async function getLegacyLaunchContext(): Promise<LegacyLaunchContext> {
  if (typeof window === "undefined") {
    return { mode: "mock", characterId: "kwame-mensah", gameHour: 14 };
  }

  const params = new URLSearchParams(window.location.search);
  const ticket = params.get("ticket");
  if (!ticket) return { mode: "mock", characterId: "kwame-mensah", gameHour: 14 };

  // Do not leave a bearer-like launch credential in browser history or copied
  // URLs after the exchange has started.
  window.history.replaceState({}, document.title, window.location.pathname);

  const response = await fetch(`/api/legacy/launch-context?ticket=${encodeURIComponent(ticket)}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(response.status === 410
      ? "This Legacy launch ticket has expired or was already used."
      : "The Legacy launch ticket could not be exchanged.");
  }

  const payload = await response.json() as Partial<LegacyLaunchContext> & { context?: Partial<LegacyLaunchContext> };
  const context = payload.context ?? payload;
  if (context.mode !== "live" || typeof context.characterId !== "string") {
    throw new Error("The Legacy launch response was invalid.");
  }

  return {
    mode: "live",
    familyId: typeof context.familyId === "string" ? context.familyId : undefined,
    characterId: context.characterId,
    gameHour: typeof context.gameHour === "number" ? context.gameHour : 14,
  };
}
