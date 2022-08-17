import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { login } from "~/models/auth.server";

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email")
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

  const { email } = result.data;

  if (await login(email)) {
    return redirect(`/confirm?email=${encodeURIComponent(email)}`);
  }

  return validationError({
    formId: result.formId,
    fieldErrors: {
      email: "not today"
    }
  });
};

export default function Index() {
  return (
    <main className="relative min-h-screen mt-10 pb-4 font-regular mx-auto container">
      <h1>Welcome</h1>
      <ValidatedForm method="post" validator={validator}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </ValidatedForm>
    </main>
  );
}
