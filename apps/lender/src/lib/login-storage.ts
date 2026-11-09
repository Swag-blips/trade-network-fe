import { storage } from "@repo/utils/storage";

const CHALLENGE_ID = "tn.loginChallenge";

export function saveLoginChallenge(challengeId: string) {
  storage.session.set(CHALLENGE_ID, challengeId);
}

export function readLoginChallenge() {
  return storage.session.get(CHALLENGE_ID);
}

export function clearLoginChallenge() {
  storage.session.remove(CHALLENGE_ID);
}
