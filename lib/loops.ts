/**
 * Loops.so integration — push milestone events & contact properties.
 *
 * All calls are fire-and-forget: failures are logged but never block the user flow.
 */

const LOOPS_API = "https://app.loops.so/api/v1";

function getApiKey(): string | undefined {
  return process.env.LOOPS_API_KEY;
}

async function loopsFetch(path: string, body: Record<string, unknown>) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[loops] LOOPS_API_KEY not set — skipping", path);
    return;
  }

  try {
    const res = await fetch(`${LOOPS_API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[loops] ${path} failed (${res.status}):`, text);
    }
  } catch (err) {
    console.error(`[loops] ${path} error:`, err);
  }
}

/**
 * Send an event + update contact properties in one call.
 * The events/send endpoint accepts top-level contact properties alongside the event.
 */
export async function pushLoopsEvent(
  email: string,
  eventName: string,
  contactProperties: Record<string, unknown> = {},
  eventProperties: Record<string, unknown> = {}
) {
  if (!email) return;

  await loopsFetch("/events/send", {
    email,
    eventName,
    eventProperties,
    // Contact properties are spread at the top level
    ...contactProperties,
  });
}

// ── Convenience helpers for each milestone ──────────────────────────

export function pushCourseCompleted(email: string) {
  return pushLoopsEvent(email, "course_completed", {
    courseCompleted: true,
    courseCompletedAt: new Date().toISOString(),
  });
}

export function pushEggHatched(email: string) {
  return pushLoopsEvent(email, "egg_hatched", {
    eggHatched: true,
    eggHatchedAt: new Date().toISOString(),
  });
}

export function pushPaymentCompleted(email: string, method: "stripe" | "crypto") {
  return pushLoopsEvent(
    email,
    "payment_completed",
    {
      paymentCompleted: true,
      paymentMethod: method,
      paymentCompletedAt: new Date().toISOString(),
    },
    { method }
  );
}

export function pushQuestCompleted(email: string, questId: number, totalCompleted: number) {
  return pushLoopsEvent(
    email,
    "quest_completed",
    {
      questsCompletedCount: totalCompleted,
      lastQuestCompletedAt: new Date().toISOString(),
    },
    { questId, totalCompleted }
  );
}

export function pushUserLogin(email: string, authMethod: "email" | "github" | "otp") {
  return pushLoopsEvent(
    email,
    "user_login",
    {
      lastLoginAt: new Date().toISOString(),
      authMethod,
    }
  );
}

export function pushUserSignup(email: string, username: string, authMethod: "email" | "github" | "otp") {
  return pushLoopsEvent(
    email,
    "user_signup",
    {
      firstName: username,
      authMethod,
      source: "openclaw-quests",
    }
  );
}

export function pushAttestationCreated(email: string, uid: string, url: string) {
  return pushLoopsEvent(
    email,
    "attestation_created",
    {
      attestationCreated: true,
      attestationUid: uid,
      attestationCreatedAt: new Date().toISOString(),
    },
    { uid, url }
  );
}
