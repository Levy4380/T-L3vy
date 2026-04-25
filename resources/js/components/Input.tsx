import { useId, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

function Input({ label, className, id, ...rest }: InputProps) {
    const { placeholder, ...inputProps } = rest;

    const fieldClass =
        'peer h-12 w-full rounded-[10px] border border-gray-300 bg-white px-3 pt-4 pb-1.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] focus:border-gray-500 focus:ring-1 focus:ring-gray-400/30 disabled:cursor-not-allowed disabled:opacity-50';

    const labelClass =
        'pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-400 transition-all duration-200 ease-out origin-left peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[7px] peer-focus:text-gray-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-[7px] peer-[:not(:placeholder-shown)]:text-gray-600';

    const autoId = useId();
    const inputId = id ?? autoId;
    const mergedClassName = [fieldClass, className].filter(Boolean).join(' ');

    return (
        <div className="relative">
            <input
                {...inputProps}
                id={inputId}
                className={mergedClassName}
                placeholder={placeholder ?? ' '}
            />
            <label htmlFor={inputId} className={labelClass}>
                {label}
            </label>
        </div>
    );
}

export default Input;
