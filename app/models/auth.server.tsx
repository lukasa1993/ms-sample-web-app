import { fetch } from "@remix-run/node";

export async function check(token: string) {
  console.log("Checking bearer", token);
  const res = await fetch("http://auth.example.com/", {
    headers: { "authorization": `bearer ${token}` }
  });

  return res.status === 200;
}

export async function login(email: string) {
  const res = await fetch("http://auth.example.com/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, type: "user" })
  });

  try {
    await res.text();
  } catch (e) {
    return false;
  }

  return res.status === 202;
}

export async function authenticate(email: string, code: string) {
  const res = await fetch("http://auth.example.com/authenticate", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });

  return await res.json();
}
