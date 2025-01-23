// src/components/iconMapping.tsx
import * as LucideIcons from "lucide-react";
import { FC } from "react";

type IconName = keyof typeof LucideIcons;

export const getIconByName = (name: IconName): FC<any> | null => {
  return LucideIcons[name] || null;
};
