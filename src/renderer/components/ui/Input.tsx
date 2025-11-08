import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    const inputStyles = error
      ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
      : 'border-input focus-visible:border-ring focus-visible:ring-ring';

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-foreground mb-1">{label}</label>}
        <input
          ref={ref}
          className={`block w-full rounded-lg border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed ${inputStyles} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
