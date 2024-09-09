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
  submitNewPassword,
} from "supertokens-auth-react/recipe/emailpassword";
import { CommunityCollection } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import { undefined } from "zod";

interface LoginProps {
  host?: string;
}
export default function PasswordReset({ host }: LoginProps) {
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        setErrorMessage("Invalid or missing reset token.");
        setIsSubmitting(false);
        return;
      }

      const response = await submitNewPassword({
        formFields: [
          { id: "password", value: password },
          { id: "token", value: token },
        ],
      });

      if (response.status === "OK") {
        // Navigate to the success page or show a success message
        window.location.assign("/auth");
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              New Password
            </label>

            <div className=" bg-white dark:bg-neutral-800">
              <div className="flex mb-2">
                <div className="flex-1">
                  <input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  />
                  <div
                    id="hs-strong-password"
                    data-hs-strong-password='{
            "target": "#password",
            "hints": "#hs-strong-password-hints",
            "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-blue-500 opacity-50 mx-1"
          }'
                    className="flex mt-2 -mx-1"
                  ></div>
                </div>
              </div>

              <div id="hs-strong-password-hints" className="mb-3">
                <div>
                  <span className="text-sm text-gray-800 dark:text-neutral-200">
                    Level:
                  </span>
                  <span
                    data-hs-strong-password-hints-weakness-text='["Empty", "Weak", "Medium", "Strong", "Very Strong", "Super Strong"]'
                    className="text-sm font-semibold text-gray-800 dark:text-neutral-200"
                  ></span>
                </div>

                <h4 className="my-2 text-sm font-semibold text-gray-800 dark:text-white">
                  Your password must contain:
                </h4>

                <ul className="space-y-1 text-sm text-gray-500 dark:text-neutral-500">
                  <li
                    data-hs-strong-password-hints-rule-text="min-length"
                    className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                  >
                    <span className="hidden" data-check="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span data-uncheck="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </span>
                    Minimum number of characters is 6.
                  </li>
                  <li
                    data-hs-strong-password-hints-rule-text="lowercase"
                    className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                  >
                    <span className="hidden" data-check="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span data-uncheck="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </span>
                    Should contain lowercase.
                  </li>
                  <li
                    data-hs-strong-password-hints-rule-text="uppercase"
                    className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                  >
                    <span className="hidden" data-check="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span data-uncheck="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </span>
                    Should contain uppercase.
                  </li>
                  <li
                    data-hs-strong-password-hints-rule-text="numbers"
                    className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                  >
                    <span className="hidden" data-check="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span data-uncheck="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </span>
                    Should contain numbers.
                  </li>
                  <li
                    data-hs-strong-password-hints-rule-text="special-characters"
                    className="hs-strong-password-active:text-teal-500 flex items-center gap-x-2"
                  >
                    <span className="hidden" data-check="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span data-uncheck="">
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </span>
                    Should contain special characters.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
          )}

          <Button
            type="submit"
            variant="solid"
            color="slate"
            className="w-full"
          >
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </div>
    </>
  );
}
