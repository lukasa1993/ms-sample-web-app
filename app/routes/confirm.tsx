import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { authenticate } from "~/models/auth.server";
import { createUserSession } from "~/session.server";

export const validator = withZod(
  z.object({
    code: z
      .string()
      .min(1, { message: "code is required" })
  })
);

export const meta: MetaFunction = () => {
  return {
    title: "Sample Web App MS"
  };
};

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(
    await request.formData()
  );

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  const email = `${new URL(request.url).searchParams.get("email")}`;

  try {
    z.string().email().min(1).parse(email);
  } catch (e) {
    validationError({
      formId: result.formId,
      fieldErrors: {
        code: "email not found"
      }
    });
  }

  const { code } = result.data;

  try {
    const tokens = await authenticate(email, code);
console.log({ tokens })
    return await createUserSession({
      request,
      redirectTo: "/app",
      remember: true,
      userId: email,
      tokens: JSON.stringify(tokens)
    });
  } catch (e) {
    console.log(e);
    return validationError({
      formId: result.formId,
      fieldErrors: {
        code: "not today"
      }
    });
  }
};

export default function Index() {
  return (
    <main className="relative min-h-screen mt-10 pb-4 font-regular container mx-auto">
      <h1>Confirm</h1>
      <ValidatedForm method="post" validator={validator}>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code
          </label>
          <div className="mt-1">
            <input
              type="text"
              datatype="otp"
              name="code"
              id="code"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="1234567890"
            />
          </div>
        </div>
      </ValidatedForm>
    </main>
  );
}
