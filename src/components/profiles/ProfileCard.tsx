import React, { useState } from "react";
import { Copy, Eye, EyeOff, Edit, Trash, Check } from "lucide-react";

interface ProfileCardProps {
  id: number;
  name: string;
  login: string;
  password: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  login,
  password,
  onEdit,
  onDelete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<"login" | "password" | null>(
    null
  );

  const copyToClipboard = (text: string, field: "login" | "password") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field); // Устанавливаем, какое поле было скопировано
    setTimeout(() => setCopiedField(null), 2000); // Сбрасываем состояние через 2 секунды
  };

  return (
    <div className="bg-white/5 shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold text-gray-200">{name}</h3>

      <div className="mt-2 flex items-center">
        <span className="text-gray-300">Login:</span>
        <span className="ml-2 text-gray-300">{login}</span>
        <button
          onClick={() => copyToClipboard(login, "login")}
          className="ml-2 text-gray-300 hover:text-gray-400"
          title="Copy Login"
        >
          {copiedField === "login" ? (
            <Check size={18} className="text-green-500" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>

      <div className="mt-2 flex items-center">
        <span className="text-gray-300">Password:</span>
        <span className="ml-2 text-gray-300">
          {showPassword ? password : "******"}
        </span>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="ml-2 text-gray-300 hover:text-gray-400"
          title={showPassword ? "Hide Password" : "Show Password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button
          onClick={() => copyToClipboard(password, "password")}
          className="ml-2 text-gray-300 hover:text-gray-400"
          title="Copy Password"
        >
          {copiedField === "password" ? (
            <Check size={18} className="text-green-500" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={onEdit}
          className="text-gray-300 bg-gray-500 p-2 rounded-md hover:bg-gray-600"
          title="Edit"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={onDelete}
          className="text-gray-300 bg-gray-500 p-2 rounded-md hover:bg-gray-600"
          title="Delete"
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
