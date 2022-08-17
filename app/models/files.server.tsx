import { fetch } from "@remix-run/node";

export async function upload(user_id: string) {
  const res = await fetch("http://ms_sample_file:7702/internal/upload", {
    method: "put",
    body: JSON.stringify({ user_id: user_id }),
    headers: { "Content-Type": "application/json" }
  });

  return await res.json();
}
