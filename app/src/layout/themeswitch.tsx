import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { SunIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function useCookie(key, initialValue) {
  const [cookieValue, setCookieValue] = useState(() => {
    try {
      const cookie = Cookies.get(key);
      return cookie ? JSON.parse(cookie) : initialValue;
    } catch (error) {
      console.error('Error reading cookie:', key, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setCookieValue(value);
      Cookies.set(key, JSON.stringify(value), { expires: 365 });
    } catch (error) {
      console.error('Error setting cookie:', key, error);
    }
  };

  return [cookieValue, setValue];
}
function ThemeSwitch() {
  const [theme, setTheme] = useCookie('theme', 'light');
  const [enabled, setEnabled] = useState(theme === 'light');

  useEffect(() => {
    const htmlSelector = document.querySelector('html');
    if (htmlSelector) {
      htmlSelector.classList.remove('light', 'dark');
      htmlSelector.classList.add(theme);
      if(theme === "dark") {

        htmlSelector.setAttribute('data-theme', "night");
      }
      else
      {
        htmlSelector.setAttribute('data-theme', "cupcake");

      }
    }
  }, [theme]);

  useEffect(() => {
    setEnabled(theme === 'light');
  }, [theme]);

  const handleThemeChange = (enabled) => {
    setTheme(enabled ? 'light' : 'dark');
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleThemeChange}
      className={classNames(
        enabled ? 'bg-gray-400' : 'bg-yellow-600',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
      )}
    >
      <span className='sr-only'>Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      >
        <span
          className={classNames(
            enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden='true'
        >
          <SunIcon className='h-3 w-3 text-gray-400' />
        </span>
        <span
          className={classNames(
            enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
          )}
          aria-hidden='true'
        >
          <SunIcon className='h-3 w-3 text-yellow-600' />
        </span>
      </span>
    </Switch>
  );
}

export default ThemeSwitch;