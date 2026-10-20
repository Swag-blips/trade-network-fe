import { storage } from "@repo/utils/storage";

const SESSION_TOKEN = "tn.loginSession";


export function saveLoginSession(sessionToken: string) {
  storage.session.set(SESSION_TOKEN, sessionToken);
}

export function readLoginSession() {
  return storage.session.get(SESSION_TOKEN);
}

export function clearLoginSession() {
  storage.session.remove(SESSION_TOKEN);
}
