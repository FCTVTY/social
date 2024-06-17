import BlurryBlurb from "../../assets/blurry-blurb.svg";
import Spline from "@splinetool/react-spline";
import BLogo from '../../assets/logo.svg';
import BDarkLogo from '../../assets/dark-logo.svg';

import "../../index.css";
import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../lib/hooks/usePageTitle";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Button,
    FormItem,
    FormMessage,
    Input,
    Form,
    FormField
} from "../../components/ui";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion"
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trackEvent } from "../../lib/utils/track-event";
const { getSubdomain } = require('tldts');

const GENERIC_ERROR = "Something went wrong. Please try again later.";

export const LoginPage = () => {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">(
        "signin"
    );
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [emailPasswordLoading, setEmailPasswordLoading] =
        useState<boolean>(false);
    const [domain, setDomain] = useState<string>(window.location.href)
    const verb = mode === "signin" ? "Sign in" : "Sign up";
    usePageTitle(verb);


    const signInSchema = z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(1, "Password is required"),
        confirm_password: mode === "signup" ? z.string() : z.string().optional(),
    });

    const signUpSchema = z
        .object({
            email: z.string().email({ message: "Invalid email address" }),
            password: z
                .string()
                .regex(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/,
                    "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol"
                ),
            confirm_password: z.string().min(1, "Confirm password is required"),
            fname: z.string().min(1, "Display name is required"),
            lname: z.string().min(1, "Display name is required"),
        })
        .refine((data) => data.password === data.confirm_password, {
            message: "Passwords do not match",
            path: ["confirm_password"],
        });

    const formSchema = mode === "signin" ? signInSchema : signUpSchema;

    useEffect(() => {
        const error = searchParams.get("error");

        if (error) {
            setError(GENERIC_ERROR);
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, [searchParams]);

    const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSetMode = (mode: "signin" | "signup" | "forgot_password") => {
        setMode(mode);
        setError(undefined);
        emailPasswordForm.clearErrors();
    };


    // @ts-ignore
    const onEmailPasswordSubmit = async (formValues) => {
        setEmailPasswordLoading(true);

        if (mode === "signup") {
            const values: z.infer<typeof signUpSchema> = formValues;
            var domainData = "app"
            try
            {
                domainData = getSubdomain(domain);
            }
            catch (e)
            {
                domainData = "app"
            }

            await emailPasswordSignUp(values.email, values.password, values.fname, values.lname, domainData);


        } else {
            const values: z.infer<typeof signInSchema> = formValues;
            await emailPasswordSignIn(values.email, values.password);
        }

        setEmailPasswordLoading(false);
    };

    const emailPasswordSignIn = async (email: string, password: string) => {
        const response = await EmailPassword.signIn({
            formFields: [
                {
                    id: "email",
                    value: email,
                },
                {
                    id: "password",
                    value: password,
                },
            ],
        });

        if (response.status === "WRONG_CREDENTIALS_ERROR") {
            setError("Invalid email or password. Please try again.");
            return;
        }
        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach((item) => {
                if (item.id === "email" || item.id === "password") {
                    setError(item.error);
                }
            });
            return;
        }

        trackEvent("user_login", { method: "email_password" });
        window.location.assign("/dashboard");
    };

    const emailPasswordSignUp = async (
        email: string,
        password: string,
        fname: string,
        lname: string,
        ffftenant :string,
    ) => {
        const response = await EmailPassword.signUp({
            formFields: [
                {
                    id: "email",
                    value: email,
                },
                {
                    id: "password",
                    value: password,
                },
                {
                    id: "first_name",
                    value: fname,
                },
                {
                    id: "last_name",
                    value: lname,
                },
                {
                    id: "fff_tenant",
                    value: ffftenant,
                },
            ],
        });
        console.log(response);

        if (response.status === "FIELD_ERROR") {
            let error = "";
            response.formFields.forEach((item) => {
                error += item.error + "\n";
            });
            setError(error);
            return;
        }

        trackEvent("user_signup", { method: "email_password" });
        window.location.assign("/");
    };

    return (
        <div className="dark h-full font-sans">
            <main className="app flex h-full min-h-full flex-1 overflow-hidden bg-gray-950 text-slate-300">
                <div className="flex min-h-full flex-1 overflow-hidden">
                    <div className="z-10 mx-auto flex min-w-[400px] flex-col justify-center bg-neutral-900 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <div className="text-center">
                                <img
                                    className="inline-block h-10 w-auto"
                                    src={BDarkLogo}
                                    alt="Your Company"
                                />
                                <h2 className="mt-8 font-heading text-3xl leading-9 tracking-tight">
                                    {verb} to B:hive Admin{" "}
                                </h2>
                            </div>

                            <div className="mb-4 mt-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Oops!</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="mt-2 flex flex-col space-y-2">


                                <motion.div
                                    key={[mode, isEmail].join("_")}
                                    initial={{ height: 10, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isEmail && (
                                        <>
                                            <div className="-mt-2 py-4">
                                                <div
                                                    className={`h-px w-full bg-neutral-700 ${clsx({
                                                        
                                                    })}`}
                                                ></div>
                                            </div>

                                            <Form {...emailPasswordForm}>
                                                <form
                                                    onSubmit={emailPasswordForm.handleSubmit(
                                                        onEmailPasswordSubmit
                                                    )}
                                                    className="flex flex-col space-y-3"
                                                >
                                                    <FormField
                                                        control={emailPasswordForm.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Input
                                                                    {...field}
                                                                    size="lg"
                                                                    type="email"
                                                                    placeholder="Email"
                                                                    className="w-full"
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={emailPasswordForm.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <Input
                                                                    {...field}
                                                                    size="lg"
                                                                    type="password"
                                                                    placeholder="Password"
                                                                    className="w-full"
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    {mode === "signup" && (
                                                        <>
                                                            <FormField
                                                                control={emailPasswordForm.control}
                                                                name="confirm_password"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <Input
                                                                            {...field}
                                                                            autoComplete="off"
                                                                            size="lg"
                                                                            type="password"
                                                                            placeholder="Confirm Password"
                                                                            className="w-full"
                                                                        />
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={emailPasswordForm.control}
                                                                name="fname"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <Input
                                                                            {...field}
                                                                            size="lg"
                                                                            type="text"
                                                                            placeholder="First Name"
                                                                            className="w-full"
                                                                        />
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={emailPasswordForm.control}
                                                                name="lname"
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <Input
                                                                            {...field}
                                                                            size="lg"
                                                                            type="text"
                                                                            placeholder="Last Name"
                                                                            className="w-full"
                                                                        />
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </>
                                                    )}

                                                    <Button
                                                        type="submit"
                                                        size="lg"
                                                        variant="outline"
                                                        className="mb-2 w-full"
                                                        loading={emailPasswordLoading}
                                                    >
                                                        {verb} with Email
                                                    </Button>
                                                </form>
                                            </Form>
                                        </>
                                    )}
                                </motion.div>

                                {!isEmail && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="mb-2 w-full"
                                        loading={emailPasswordLoading}
                                        onClick={() => setIsEmail(true)}
                                    >
                                        {verb} with Email
                                    </Button>
                                )}
                            </div>

                            <motion.div
                                key={mode}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >

                            </motion.div>
                        </div>
                    </div>
                    <div className="relative hidden flex-1 bg-neutral-950 lg:flex">
                        <div className="flex h-full w-full items-center justify-center">
                            <div
                                className="pointer-events-none absolute -mt-36 translate-x-[0vw] translate-y-[10vh] scale-[110%] opacity-50 md:block"
                                aria-hidden="true"
                            >
                                <img
                                    src="https://images.pexels.com/photos/3856027/pexels-photo-3856027.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    className="h-[100vh] w-[100vw] object-cover"
                                    alt="Page Illustration"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};