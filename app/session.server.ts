import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

if (process.env.NODE_ENV === "production" && process.env.SESSION_TYPE !== "secure") {
  console.error("---------------------------------------------------");
  console.error("Your ENV IS PRODUCTION AND SESSION TYPE is not 'secure'");
  console.error("---------------------------------------------------");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.SESSION_TYPE === "secure"
  }
});

export const USER_SESSION_KEY = "userId";
export const USER_TOKENS_KEY = "tokens";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
                                          request,
                                          userId,
                                          tokens,
                                          remember,
                                          redirectTo
                                        }: {
  request: Request;
  userId: string;
  tokens: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(USER_TOKENS_KEY, tokens);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined
      })
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
