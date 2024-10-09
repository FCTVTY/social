import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { SelectField, TextField } from "../../components/Fields";
import { Link } from "react-router-dom";
import logo from "../../assets/bob-badge.svg";
import mlogo from "../../assets/logo-light.svg";

import { useForm } from "react-hook-form";
import * as z from "zod";
import EmailPassword, {
  sendPasswordResetEmail,
} from "supertokens-auth-react/recipe/emailpassword";
import { Form, FormField, FormItem, FormMessage } from "../../components/form";
import { Input } from "../../components/input";
import { Alert, AlertDescription, AlertTitle } from "../../components/alert";
import { emailPasswordSignIn } from "supertokens-web-js/lib/build/recipe/thirdpartyemailpassword";
import { CommunityCollection } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
interface LoginProps {
  host?: string;
}
export default function Recover({ host }: LoginProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">(
    "forgot_password",
  );

  const [community, setCommunity] = useState<Partial<CommunityCollection>>();

  useEffect(() => {
    fetchDetails();
  }, [host]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/community?name=${host}`,
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
  });

  const formSchema = signInSchema;

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
  });

  const onEmailPasswordSubmit = async (
    formValues: z.infer<typeof formSchema>,
  ) => {
    try {
      let response = await sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: formValues.email,
          },
        ],
      });

      if (response.status === "FIELD_ERROR") {
        // one of the input formFields failed validation
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax).
            window.alert(formField.error);
          }
        });
      } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED") {
        // this can happen due to automatic account linking. Please read our account linking docs
      } else {
        // reset password email sent.
        window.alert("Please check your email for the password reset link");
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        window.alert("Oops! Something went wrong.");
      }
    }
  };

  const emailPasswordSignIn = async (email: string, password: string) => {
    const response = await EmailPassword.signIn({
      formFields: [{ id: "email", value: email }],
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

  return (
    <>
      <div className="flex flex-col">
        <Link to="https://bhivecommunity.co.uk" aria-label="Feed">
          <img
            src={community?.community?.logo || mlogo}
            className="h-10 w-auto"
            alt="Logo"
          />
        </Link>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-400">
            Recover Lost Account
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Please enter your email address. If we find your account, we'll send
            you instructions to reset your password.
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

          <div>
            <Button
              type="submit"
              variant="solid"
              color="slate"
              className="w-full"
            >
              <span>
                Recover Account <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
          <a className="mt-2 text-sm text-gray-700" href="/auth/">
            Back to login
          </a>
        </form>
      </Form>
    </>
  );
}
