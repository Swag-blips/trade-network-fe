import { storage } from "@repo/utils/storage";

const SESSION = "tn.onboarding";
const PROGRESS = "tn.onboardingProgress";

/** What sign-up collects and the later steps still need. */
export interface OnboardingSession {
  challengeId: string;
  /** Absent when a pending account arrives through login, which skips the welcome screen. */
  firstName?: string;
}

function read<T>(key: string): T | null {
  const raw = storage.session.get(key);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Onboarding happens in one sitting, so this lives in session storage: the id
 * is a handle whose code expires in 10 minutes, and a stale one is worse than
 * none. Every re-signup issues a new id, so this always overwrites.
 */
export function saveOnboarding(session: OnboardingSession) {
  storage.session.set(SESSION, JSON.stringify(session));
}

export function readOnboarding() {
  return read<OnboardingSession>(SESSION);
}

export function readChallengeId() {
  return readOnboarding()?.challengeId ?? null;
}

/** Only the welcome screen's greeting needs this. */
export function readOnboardFirstName() {
  return readOnboarding()?.firstName ?? null;
}

/** Where the wizard had got to, so a refresh doesn't drop back to step 1. */
export function saveOnboardingProgress(progress: unknown) {
  storage.session.set(PROGRESS, JSON.stringify(progress));
}

/** Unvalidated: it is only ever read back by the writer, on the same tab. */
export function readOnboardingProgress<T>(): T | null {
  return read<T>(PROGRESS);
}

/** Call once onboarding completes. */
export function clearOnboarding() {
  storage.session.remove(SESSION);
  storage.session.remove(PROGRESS);
}
