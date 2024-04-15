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

const Register: React.FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>('signup');

  const handleSetMode = (mode: 'signin' | 'signup' | 'forgot_password') => {
    setMode(mode);
    emailPasswordForm.clearErrors();
  };

  const signUpSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, 'Password is required'),
    confirm_password: mode === 'signup' ? z.string() : z.string().optional(),
    fname: z.string().min(1, 'Display name is required'),
    lname: z.string().min(1, 'Display name is required'),
  });

  const formSchema = signUpSchema;

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onEmailPasswordSubmit = async (formValues: z.infer<typeof formSchema>) => {
    try {
      await emailPasswordSignUp(formValues.email, formValues.password, formValues.fname, formValues.lname);
    } catch (error) {
      // @ts-ignore
      setError(error.message);
    }
  };

  const emailPasswordSignUp = async (email: string, password: string, fname: string, lname: string) => {
    const response = await EmailPassword.signUp({
      formFields: [
        { id: 'email', value: email },
        { id: 'password', value: password },
        { id: 'first_name', value: fname },
        { id: 'last_name', value: lname },
      ],
    });

    if (response.status !== 'OK') {
      let error = '';
      if (response.status !== "SIGN_UP_NOT_ALLOWED") {
        response.formFields.forEach((item) => {
          error += item.error + '\n';
        });
      }
      setError(error);
      return;
    }

    // Redirect user to desired page upon successful registration
    window.location.assign('/feed');
  };

  return (
      <>
          <div className="flex flex-col">
              <Link to="/" aria-label="Feed">
                  <img src={logo} className="h-10 w-auto" alt="Logo"/>
              </Link>
              <div className="mt-20">
                  <h2 className="text-lg font-semibold text-gray-900">Get started for free</h2>
                  <p className="mt-2 text-sm text-gray-700">
                      Already registered?{' '}
                      <Link to="/login" className="font-medium text-blue-600 hover:underline">
                          Sign in
                      </Link>{' '}
                      to your account.
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
                  onSubmit={emailPasswordForm.handleSubmit(
                      onEmailPasswordSubmit
                  )}
                  className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">

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
                              className=""
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
                              className=""
                          />
                          <FormMessage/>
                      </FormItem>
                  )}
              />
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
                              placeholder="Password"
                              className="col-span-full"
                          />
                          <FormMessage/>
                      </FormItem>
                  )}
              />
              {mode === 'signup' && (
                  <FormField
                      control={emailPasswordForm.control}
                      name="confirm_password"
                      render={({field}) => (
                          <FormItem className="col-span-full">
                              <Input
                                  {...field}
                                  autoComplete="off"
                                  size="lg"
                                  type="password"
                                  placeholder="Confirm Password"
                                  className="col-span-full"
                              />
                              <FormMessage/>
                          </FormItem>
                      )}
                  />
              )}
              <SelectField className="col-span-full" label="How did you hear about us?" id="referral_source"
                           name="referral_source">
                  <option>AltaVista search</option>
                  <option>Super Bowl commercial</option>
                  <option>Our route 34 city bus ad</option>
                  <option>The “Never Use This” podcast</option>
              </SelectField>
              <div className="col-span-full">
                  <Button type="submit" variant="solid" color="slate" className="w-full">
                      <span>Sign up <span aria-hidden="true">&rarr;</span></span>
                  </Button>
              </div>
              </form>
          </Form>
      </>
  );
};

export default Register;
