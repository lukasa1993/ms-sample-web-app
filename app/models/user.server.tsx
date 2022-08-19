import { fetch } from "@remix-run/node";

export async function user(token: string) {
  const res = await fetch("http://api.example.com/user", {
    headers: { "authorization": `bearer ${token}` }
  });

  return res.json();
}
