interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

function Button ({ children, onClick, disabled = false, className }: Readonly<ButtonProps>) {
  return (
    <button
      className={`${
        disabled
          ? 'bg-black/20 text-black/50 cursor-not-allowed'
          : 'bg-mariner-900 text-white'
        } text-base font-bold px-4 py-2 rounded-sm flex justify-center items-center w-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
