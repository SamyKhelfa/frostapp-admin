import { postJSON, getJSON } from "./api";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export async function login(payload: LoginPayload) {
  return postJSON("/auth/login", payload);
}

export async function register(payload: RegisterPayload) {
  return postJSON("/auth/register", payload);
}

export async function me() {
  return getJSON("/auth/me");
}

export async function logout() {
  return postJSON("/auth/logout", {});
}
