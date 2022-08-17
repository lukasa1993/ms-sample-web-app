import { json, LoaderFunction } from "@remix-run/server-runtime";
import { getSession, logout, USER_SESSION_KEY, USER_TOKENS_KEY } from "~/session.server";
import { check } from "~/models/auth.server";
import { upload } from "~/models/files.server";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await getSession(request);

    const userID = session.get(USER_SESSION_KEY);
    const tokens = JSON.parse(session.get(USER_TOKENS_KEY));

    if (await check(tokens.access_token)) {
      const uploadPayload = await upload(userID);
      uploadPayload.fields = {
        ...uploadPayload.fields,
        "x-amz-meta-user-id": userID
      };
      return json(uploadPayload);
    } else {
      return await logout(request);
    }
  } catch (e) {
    return await logout(request);
  }
};


export default function Index() {
  const data = useLoaderData();
  const [type, setType] = useState("binary/octet-stream");

  return (
    <div className="container mx-auto">
      <h1>Sample Web APP</h1>

      <div className="flex justify-center">
        <div className="mb-3 w-96">
          <form action={data.url} method="post" encType="multipart/form-data" >
            <input
              type="file"
              name="file"
              onChange={(e) => {
                setType(e.target.files?.[0].type || "binary/octet-stream");
              }}
            />
            <input type="hidden" name={"Content-Type"} value={type} />
            {Object.keys(data.fields).map(field => (
              <input key={field} type="hidden" name={field} value={data.fields[field]} />
            ))}
            <input type="submit" value="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
