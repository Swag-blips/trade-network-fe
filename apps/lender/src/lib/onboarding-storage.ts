import { storage } from "@repo/utils/storage";

const CHALLENGE_ID = "tn.onboarding";
const PROGRESS = "tn.onboardingProgress";

/**
 * Session storage only: the id works for 60 minutes after its code is entered,
 * and every signup or login issues a new one, so this always overwrites.
 */
export function saveChallengeId(challengeId: string) {
  storage.session.set(CHALLENGE_ID, challengeId);
}

export function readChallengeId() {
  return storage.session.get(CHALLENGE_ID);
}

/** Where the wizard had got to, so a refresh doesn't drop back to step 1. */
export function saveOnboardingProgress(progress: unknown) {
  storage.session.set(PROGRESS, JSON.stringify(progress));
}

/** Unvalidated: it is only ever read back by the writer, on the same tab. */
export function readOnboardingProgress<T>(): T | null {
  const raw = storage.session.get(PROGRESS);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Call once onboarding completes. */
export function clearOnboarding() {
  storage.session.remove(CHALLENGE_ID);
  storage.session.remove(PROGRESS);
}
