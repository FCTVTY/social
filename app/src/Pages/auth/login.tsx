import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { SelectField, TextField } from "../../components/Fields";
import { Link } from "react-router-dom";
import logo from "../../assets/bob-badge.svg";
import mlogo from "../../assets/logo-light.svg";

import { useForm } from "react-hook-form";
import * as z from "zod";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { Form, FormField, FormItem, FormMessage } from "../../components/form";
import { Input } from "../../components/input";
import { Alert, AlertDescription, AlertTitle } from "../../components/alert";
import { emailPasswordSignIn } from "supertokens-web-js/lib/build/recipe/thirdpartyemailpassword";
import { Community, CommunityCollection } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";

interface LoginProps {
  host: string;
}
export default function Login({ host }: LoginProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">(
    "signin",
  );

  const [community, setCommunity] = useState<Partial<Community>>();

  useEffect(() => {
    fetchDetails();
  }, [host]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/scommunity?name=${host}`,
      );
      setCommunity(response.data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const handleSetMode = (mode: "signin" | "signup" | "forgot_password") => {
    setMode(mode);
    emailPasswordForm.clearErrors();
  };

  const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
  });

  const formSchema = signInSchema;

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onEmailPasswordSubmit = async (
    formValues: z.infer<typeof formSchema>,
  ) => {
    try {
      await emailPasswordSignIn(formValues.email, formValues.password);
    } catch (error) {
      // @ts-ignore
      setError(error.message);
    }
  };

  const emailPasswordSignIn = async (email: string, password: string) => {
    const response = await EmailPassword.signIn({
      formFields: [
        { id: "email", value: email },
        { id: "password", value: password },
      ],
    });

    console.log(response);
    if (response.status == "OK") {
      window.location.assign("/s");
    }
    if (response.status == "WRONG_CREDENTIALS_ERROR") {
      setError("Wrong username/password");
    }
    // Redirect user to desired page upon successful registration
    // window.location.assign('/feed');
  };

  function myFunction() {
    var x = document.getElementsByName("password")[0];
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <Link to="https://bhivecommunity.co.uk" aria-label="Feed">
          <img
            src={community?.logo || mlogo}
            className="h-10 w-auto"
            alt="Logo"
          />
        </Link>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>{" "}
            for a free account.
          </p>
        </div>
      </div>

      <div className="mb-4 mt-6">
        {error && (
          <Alert variant="destructive" className="dark:bg-white">
            <AlertTitle>Oops!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <Form {...emailPasswordForm}>
        <form
          onSubmit={emailPasswordForm.handleSubmit(onEmailPasswordSubmit)}
          className="mt-10 grid grid-cols-1 gap-y-8"
        >
          <FormField
            control={emailPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <Input {...field} size="lg" type="email" placeholder="Email" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={emailPasswordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <Input {...field} size="lg" type="password" placeholder="" />

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                onClick={() => myFunction()}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="comments" className="font-medium text-gray-900">
                Toggle Password
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="solid"
              color="slate"
              className="w-full"
            >
              <span>
                Sign in <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
          <a className="mt-2 text-sm text-gray-700" href="/auth/recover">
            Forgotten username/password?
          </a>
        </form>
      </Form>
    </>
  );
}
