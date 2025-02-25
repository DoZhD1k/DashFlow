import React, { useState, useEffect } from "react";
import SearchBar from "../components/profiles/SearchBar";
import ProfileCard from "../components/profiles/ProfileCard";
import Modal from "../components/profiles/Modal";
import { invoke } from "@tauri-apps/api/core";
import { Plus, Download } from "lucide-react"; // ✅ Добавили иконку загрузки
import Loader from "~/components/Loader";

interface Profile {
  id: number;
  name: string;
  login: string;
  password: string;
  note?: string;
}

export const Profiles: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
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
      const response = await invoke<string>("get_profiles_command");
      const parsedResponse = JSON.parse(response);

      if (Array.isArray(parsedResponse)) {
        setProfiles(parsedResponse);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setName(profile.name);
    setLogin(profile.login);
    setNote(profile.note || "");
    setPassword("");
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
        await invoke("update_profiles", {
          id: editingProfile.id,
          name,
          login,
          password,
          note,
        });
      } else {
        await invoke("add_profiles", { name, login, password, note });
      }
      setIsModalOpen(false);
      setEditingProfile(null);
      fetchProfiles();
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const downloadProfilesAsTxt = () => {
    if (profiles.length === 0) {
      alert("Нет профилей для скачивания.");
      return;
    }

    const textContent = profiles
      .map(
        (profile) =>
          `Имя: ${profile.name}\nЛогин: ${profile.login}\nПароль: ${
            profile.password || "Нет данных"
          }\nЗаметка: ${profile.note || "Нет"}\n\n`
      )
      .join("");

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "profiles.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-stone-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen p-6 dark:bg-stone-900 overflow-y-auto custom-scrollbar">
      <div className="flex flex-1 justify-between items-center text-center p-2">
        <h1 className="text-2xl font-bold mb-4">Профили</h1>
        <div></div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex gap-2 mx-2">
          <button
            onClick={downloadProfilesAsTxt}
            title="Скачать профили"
            className="mb-4 px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Download className="w-5 h-5 mr-1" />
            Скачать
          </button>

          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingProfile(null);
              setName("");
              setLogin("");
              setPassword("");
              setNote("");
            }}
            title="Добавить профиль"
            className="mb-4 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-1" />
            Добавить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
