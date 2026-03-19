const AUTH_KEY = "harvest_authed";

export function getIsLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function setLoggedIn(name = "", email = "") {
  localStorage.setItem(AUTH_KEY, "1");
  if (name) localStorage.setItem("harvest_name", name);
  if (email) localStorage.setItem("harvest_email", email);
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("harvest_name");
  localStorage.removeItem("harvest_email");
}
