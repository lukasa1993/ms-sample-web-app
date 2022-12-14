import { json, LoaderFunction } from "@remix-run/server-runtime";
import { getSession, logout, USER_SESSION_KEY, USER_TOKENS_KEY } from "~/session.server";
import { check } from "~/models/auth.server";
import { upload } from "~/models/files.server";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { user } from "~/models/user.server";
import { company } from "~/models/company.server";

export const loader: LoaderFunction = async ({ request }) => {
  let authorized = false;
  let userID = null;
  let tokens = null;

  try {
    const session = await getSession(request);

    userID = session.get(USER_SESSION_KEY);
    tokens = JSON.parse(session.get(USER_TOKENS_KEY));
    authorized = await check(tokens.access_token);
  } catch (e) {
  }

  if (!authorized) {
    return await logout(request);
  }

  try {

    const userData = await user(tokens.access_token);
    let companyData = null;

    try {
      companyData = await company(tokens.access_token);
    } catch (e) {
    }

    const uploadPayload = await upload(tokens.access_token, userID);
    uploadPayload.fields = {
      ...uploadPayload.fields,
      "x-amz-meta-user-id": userID
    };

    return json({ ...uploadPayload, user: userData, company: companyData });
  } catch (e) {
    console.log(e);
    return json({});
  }
};


export default function Index() {
  const data = useLoaderData();
  const [type, setType] = useState("binary/octet-stream");

  return (
    <div className="container mx-auto">
      <h1>Sample Web APP</h1>
      <h2>Welcome <strong>{data?.user?.name}</strong>&nbsp;<strong>{data?.company?.name}</strong></h2>
      <div className="flex justify-center">
        <div className="mb-3 w-96">
          <form action={data?.url} method="post" encType="multipart/form-data">
            <input
              type="file"
              name="file"
              onChange={(e) => {
                setType(e.target.files?.[0].type || "binary/octet-stream");
              }}
            />
            <input type="hidden" name={"Content-Type"} value={type}/>
            {Object.keys(data?.fields || {}).map(field => (
              <input key={field} type="hidden" name={field} value={data.fields[field]}/>
            ))}
            <input type="submit" value="submit"/>
          </form>
        </div>
      </div>
    </div>
  );
}
