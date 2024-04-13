import React from 'react';
import Button  from '../../components/Button';
import { TextField } from '../../components/Fields';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-light.svg';

const Login: React.FC = () => {
  // @ts-ignore
  // @ts-ignore
  return (
      <>
        <div className="flex flex-col">
          <Link to="/" aria-label="Home">
            <img src={logo} className="h-10 w-auto" alt="Logo" />
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
              for a free trial.
            </p>
          </div>
        </div>
        <form action="#" className="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
          />
          <TextField
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
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
        </form>
      </>
  );
};

export default Login;
