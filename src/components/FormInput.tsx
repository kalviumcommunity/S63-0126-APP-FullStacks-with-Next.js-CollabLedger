import { forwardRef, InputHTMLAttributes } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  id: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, type = "text", ...rest }, ref) => {
    return (
      <div className="mb-3">
        <label htmlFor={id} className="block mb-1 font-medium text-gray-700">
          {label}
        </label>
        <input
          id={id}
          type={type}
          ref={ref}
          aria-invalid={!!error}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...rest}
        />
        {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
