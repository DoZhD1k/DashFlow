import React from "react";
import * as LucideIcons from "lucide-react";

interface IconInputProps {
  icon: string;
  onIconChange: (icon: string) => void;
}

const IconInput: React.FC<IconInputProps> = ({ icon, onIconChange }) => {
  const iconNames = Object.keys(LucideIcons);

  return (
    <div>
      <label className="flex text-gray-700 dark:text-gray-200 justify-between">
        Иконка{" "}
        <p
          className="text-xs cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={() => window.open("https://lucide.dev/icons/", "_blank")}
        >
          Ищите желаемые иконки тут
        </p>
      </label>
      <input
        type="text"
        value={icon}
        onChange={(e) => onIconChange(e.target.value)}
        list="icon-list"
        className="w-full p-2 border border-gray-300 rounded mt-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
        placeholder="Введите название иконки (например, Github)"
        required
      />
      <datalist id="icon-list">
        {iconNames.map((iconName) => (
          <option key={iconName} value={iconName} />
        ))}
      </datalist>
    </div>
  );
};

export default IconInput;
