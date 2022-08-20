import { fetch } from "@remix-run/node";

export async function company(token: string) {
  const res = await fetch("http://api.example.com/company", {
    headers: { "authorization": `bearer ${token}` }
  });

  return res.json();
}
