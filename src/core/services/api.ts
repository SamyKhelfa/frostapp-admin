export const API_BASE =
  (import.meta.env.VITE_API_BASE as string) || "http://localhost:3000";

async function handleRes(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw data;
  return data;
}

export async function postJSON(
  path: string,
  body: any,
  opts: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
    ...opts,
  });
  return handleRes(res);
}

export async function getJSON(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
    ...opts,
  });
  return handleRes(res);
}
