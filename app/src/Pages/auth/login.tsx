import React, { useState } from 'react';
import Button from '../../components/Button';
import { SelectField, TextField } from '../../components/Fields';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-light.svg';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import {Form, FormField, FormItem, FormMessage} from "../../components/form";
import {Input} from "../../components/input";
import {Alert, AlertDescription, AlertTitle} from "../../components/alert";
import {emailPasswordSignIn} from "supertokens-web-js/lib/build/recipe/thirdpartyemailpassword";

const Login: React.FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>('signin');

  const handleSetMode = (mode: 'signin' | 'signup' | 'forgot_password') => {
    setMode(mode);
    emailPasswordForm.clearErrors();
  };

  const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, 'Password is required'),

  });

  const formSchema = signInSchema;

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onEmailPasswordSubmit = async (formValues: z.infer<typeof formSchema>) => {
    try {
      await emailPasswordSignIn(formValues.email, formValues.password);
    } catch (error) {
      // @ts-ignore
      setError(error.message);
    }
  };

  const emailPasswordSignIn = async (email: string, password: string,) => {
    const response = await EmailPassword.signIn({
      formFields: [
        { id: 'email', value: email },
        { id: 'password', value: password },
      ],
    });

    console.log(response)
    if(response.status == "OK")
    {
        window.location.assign('/feed');
    }
    if(response.status == "WRONG_CREDENTIALS_ERROR")
    {
        setError("Wrong username/password")
    }
    // Redirect user to desired page upon successful registration
   // window.location.assign('/feed');
  };

  return (
      <>
        <div className="flex flex-col">
          <Link to="/" aria-label="Feed">
            <img src={logo} className="h-10 w-auto" alt="Logo"/>
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Don’t have an account?{' '}
              <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </Link>{' '}
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

          <form onSubmit={emailPasswordForm.handleSubmit(
              onEmailPasswordSubmit
          )} className="mt-10 grid grid-cols-1 gap-y-8">
            <FormField

                control={emailPasswordForm.control}
                name="email"
                render={({field}) => (
                    <FormItem className="col-span-full">
                      <Input
                          {...field}
                          size="lg"
                          type="email"
                          placeholder="Email"

                      />
                      <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField

                control={emailPasswordForm.control}
                name="password"
                render={({field}) => (
                    <FormItem className="col-span-full">
                      <Input
                          {...field}
                          size="lg"
                          type="password"
                          placeholder=""

                      />
                      <FormMessage/>
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
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
              </Button>
            </div>
            <a className="mt-2 text-sm text-gray-700" href="/auth/reset-password">Forgotten password?</a>
          </form>
        </Form>
      </>
  );
};

export default Login;
