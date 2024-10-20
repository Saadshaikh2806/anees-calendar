import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  size?: 'small' | 'medium';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, size = 'medium' }) => {
  const toggleClass = checked ? 'bg-blue-600' : 'bg-gray-200';

  // Define sizes
  const switchSizes = {
    small: 'w-10 h-5',
    medium: 'w-14 h-7',
  };

  const dotSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
  };

  const labelSizes = {
    small: 'text-xs',
    medium: 'text-sm',
  };

  const translateX = {
    small: checked ? 'translate-x-5' : 'translate-x-0',
    medium: checked ? 'translate-x-7' : 'translate-x-0',
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className={`block ${toggleClass} ${switchSizes[size]} rounded-full transition-colors duration-200 ease-in-out`}></div>
        <div className={`absolute left-0.5 top-0.5 bg-white ${dotSizes[size]} rounded-full transition-transform duration-200 ease-in-out ${translateX[size]}`}></div>
      </div>
      <div className={`ml-3 ${labelSizes[size]} font-medium text-gray-700`}>{label}</div>
    </label>
  );
};

export default ToggleSwitch;
