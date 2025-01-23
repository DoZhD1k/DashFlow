import React from "react";

interface ColorOption {
  name: string;
  value: string;
}

interface ColorSelectorProps {
  predefinedColors: ColorOption[];
  selectedColor: string;
  customColor: string;
  onColorChange: (color: string) => void;
  onCustomColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  predefinedColors,
  selectedColor,
  customColor,
  onColorChange,
  onCustomColorChange,
}) => {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-200">
        Цвет Иконки
      </label>
      <select
        value={selectedColor}
        onChange={(e) => {
          onColorChange(e.target.value);
        }}
        className="w-full p-2 border border-gray-300 rounded mt-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none"
        required
      >
        {predefinedColors.map((color) => (
          <option key={color.value} value={color.value}>
            {color.name}
          </option>
        ))}
      </select>
      {selectedColor === "custom" && (
        <input
          type="color"
          value={customColor}
          onChange={(e) => onCustomColorChange(e.target.value)}
          className="w-full h-10 p-0 border-0 mt-2"
          required
        />
      )}
    </div>
  );
};

export default ColorSelector;
