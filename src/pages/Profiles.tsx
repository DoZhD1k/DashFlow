import React, { useState, useEffect } from "react";
import SearchBar from "../components/profiles/SearchBar";
import ProfileCard from "../components/profiles/ProfileCard";
import Modal from "../components/profiles/Modal";
import { invoke } from "@tauri-apps/api/core";
import { Plus } from "lucide-react";

interface Profile {
  id: number;
  name: string;
  login: string;
  password: string;
  note?: string;
}

export const Profiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  const fetchProfiles = async () => {
    try {
      console.log("Fetching profiles...");

      // Получаем данные с помощью invoke
      const response = await invoke<string>("get_profiles_command");
      console.log("Raw response from backend:", response);

      // Парсим JSON-строку
      const parsedResponse = JSON.parse(response);
      console.log("Parsed response:", parsedResponse);

      // Проверяем, массив ли это
      if (Array.isArray(parsedResponse)) {
        console.log("Parsed response is an array:", parsedResponse);
        setProfiles(parsedResponse);
      } else {
        console.error("Parsed response is not an array:", parsedResponse);
        setProfiles([]);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

  // Добавляем useEffect для вызова fetchProfiles при монтировании компонента
  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = Array.isArray(profiles)
    ? profiles.filter((profile) =>
        (profile.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setName(profile.name);
    setLogin(profile.login);
    setNote(profile.note || "");
    setPassword(""); // Пароль не отображается для редактирования
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await invoke("delete_profiles", { id });
      fetchProfiles();
    } catch (error) {
      console.error("Failed to delete profile:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingProfile) {
        // Редактировать существующий профиль
        await invoke("update_profiles", {
          id: editingProfile.id,
          name,
          login,
          password,
          note,
        });
      } else {
        // Добавить новый профиль
        await invoke("add_profiles", {
          name,
          login,
          password,
          note,
        });
      }

      setIsModalOpen(false);
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-1 justify-between items-center text-center p-2">
        <h1 className="text-2xl font-bold mb-4">Профили</h1>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingProfile(null);
            setName("");
            setLogin("");
            setPassword("");
            setNote("");
          }}
          className="mb-4 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProfiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            id={profile.id}
            name={profile.name}
            login={profile.login}
            password={profile.password}
            onEdit={() => handleEdit(profile)}
            onDelete={() => handleDelete(profile.id)}
          />
        ))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        name={name}
        setName={setName}
        login={login}
        setLogin={setLogin}
        password={password}
        setPassword={setPassword}
        note={note}
        setNote={setNote}
      />
    </div>
  );
};
