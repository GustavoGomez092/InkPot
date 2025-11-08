import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

/**
 * Select/Dropdown component
 *
 * A styled select element with optional label, error message, and helper text.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-foreground mb-1">{label}</label>}
        <select
          ref={ref}
          className={`
            w-full
            px-3
            py-2
            border
            rounded-lg
            bg-background
            text-foreground
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            disabled:bg-muted
            disabled:text-muted-foreground
            disabled:cursor-not-allowed
            ${error ? 'border-destructive' : 'border-input'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
