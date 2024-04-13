import React from 'react';
import clsx from 'clsx';

const formClasses =
    'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm';

interface LabelProps {
  id: string;
  children: React.ReactNode;
}

function Label({ id, children }: LabelProps) {
  return (
      <label
          htmlFor={id}
          className="mb-3 block text-sm font-medium text-gray-700"
      >
        {children}
      </label>
  );
}

interface TextFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  className?: string;
}

export function TextField({
                            id,
                            label,
                            type = 'text',
                            className = '',
                            ...props
                          }: TextFieldProps) {
  return (
      <div className={className}>
        {label && <Label id={id}>{label}</Label>}
        <input id={id} type={type} {...props} className={formClasses} />
      </div>
  );
}

interface SelectFieldProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label?: string;
  className?: string;
}

export function SelectField({
                              id,
                              label,
                              className = '',
                              ...props
                            }: SelectFieldProps) {
  return (
      <div className={className}>
        {label && <Label id={id}>{label}</Label>}
        <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
      </div>
  );
}
