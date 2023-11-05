interface InputProps {
  readonly value: string
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readonly placeholder?: string
  readonly type?: string
  readonly role?: string
  readonly name?: string
  readonly label?: string
  readonly required?: boolean
  readonly leadingIcon?: React.ReactNode
  readonly trailingIcon?: React.ReactNode
}

function Input ({
  value,
  onChange,
  placeholder,
  type,
  name,
  label,
  role,
  required,
  leadingIcon,
  trailingIcon
}: Readonly<InputProps>) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="text-black/70 text-xs">
        {label}
      </label>
      <div className="relative">
        {leadingIcon !== undefined && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            {leadingIcon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          role={role}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="text-base px-2 py-1 border-2 border-black/50 focus:outline-none focus:border-black rounded-sm pl-8 w-full"
        />
        {trailingIcon !== undefined && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            {trailingIcon}
          </span>
        )}
      </div>
    </div>
  )
}

export default Input
