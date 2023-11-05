import { CheckIcon } from './icons'

interface CheckBoxProps {
  readonly label: string
  readonly isSelected: boolean
  readonly onCheckboxChange: () => void
}

function CheckBox ({
  label,
  isSelected,
  onCheckboxChange
}: Readonly<CheckBoxProps>) {
  const checkStyles = isSelected
    ? 'border-[1px] border-mariner-900 bg-mariner-900'
    : 'border-[1px] border-black/50'

  return (
    <button className="flex items-center cursor-pointer" onClick={onCheckboxChange}>
      <span className={`${checkStyles} rounded-full w-4 h-4 mr-2`}>
        {isSelected && (
          <CheckIcon className="text-white font-bold" />
        )}
      </span>
      <span className='text-base text-black/80'>{label}</span>
    </button>
  )
}

export default CheckBox
