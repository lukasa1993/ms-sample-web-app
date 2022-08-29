import { fetch } from "@remix-run/node";

export async function upload(token: string, user_id: string) {
  const res = await fetch("http://api.example.com/files/create", {
    method: "put",
    body: JSON.stringify({ user_id: user_id }),
    headers: { "Content-Type": "application/json", "authorization": `bearer ${token}` }
  });

  return await res.json();
}
