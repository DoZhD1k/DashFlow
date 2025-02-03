import * as LucideIcons from "lucide-react";
import { FC } from "react";
import { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

export const getIconByName = (name: string): FC<LucideProps> | null => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1); // ✅ Только первая буква большая

  console.log("🔍 Ищем иконку:", formattedName);

  if (formattedName in LucideIcons) {
    console.log("✅ Найдена иконка:", formattedName);
    return LucideIcons[formattedName as IconName] as FC<LucideProps>;
  } else {
    console.warn(`🚨 Иконка "${formattedName}" не найдена.`);
    return null;
  }
};
