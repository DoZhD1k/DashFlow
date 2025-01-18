import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Code, Plus, Folder } from "lucide-react";

type Project = {
  id: number;
  name: string;
  path: string;
  description: string;
};

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newDesc, setNewDesc] = useState("");

  async function loadProjects() {
    console.log("loadProjects() called");
    try {
      console.log("Вызов invoke('list_projects')");
      const result = await invoke<Project[]>("list_projects");
      console.log("list_projects вернул:", result);
      setProjects(result);
    } catch (err) {
      console.error("Ошибка при list_projects:", err);
    }
  }

  async function handleAdd() {
    console.log("=== handleAdd() start ===");
    console.log("Данные для создания:", {
      newName,
      newPath,
      newDesc,
    });

    try {
      console.log("Вызов invoke('create_project') с аргументами:", {
        name: newName,
        path: newPath,
        description: newDesc,
      });
      const newId = await invoke<number>("create_project", {
        name: newName,
        path: newPath,
        description: newDesc,
      });
      console.log("create_project вернул ID =", newId);

      console.log("Вызываем loadProjects() для обновления списка...");
      await loadProjects();
      console.log("Список проектов обновлён");

      setNewName("");
      setNewPath("");
      setNewDesc("");
      setShowModal(false);
      console.log("Форма сброшена, модалка закрыта");
    } catch (err) {
      console.error("Ошибка при create_project:", err);
    }
    console.log("=== handleAdd() end ===");
  }

  const openInVSCode = async (path) => {
    try {
      await invoke("open_in_vscode", { path });
      console.log(`Открыто в VSCode: ${path}`);
    } catch (err) {
      console.error("Ошибка открытия VSCode:", err);
      alert(`Не удалось открыть в VSCode: ${err}`);
    }
  };

  useEffect(() => {
    console.log("useEffect: первый рендер, вызываем loadProjects()");
    loadProjects();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Список проектов */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between py-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Список проектов
          </h2>
          <button
            onClick={() => {
              console.log("Нажата кнопка: показать модалку");
              setShowModal(true);
            }}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-500 transition text-white px-1 py-1 rounded-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {projects.map((p) => (
          <div
            key={p.id}
            className="mb-4 p-3 bg-white/5 dark:bg-white/10 rounded-md flex flex-col gap-1"
          >
            <p className="font-bold">{p.name}</p>
            <p className="text-xs opacity-70">{p.path}</p>
            {p.description && <p className="text-sm">{p.description}</p>}
            <button
              onClick={() => openInVSCode(p.path)}
              className="mt-2 flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-500 transition text-white px-3 py-1 rounded-md"
            >
              <Code className="w-4 h-4" />
              Открыть в VSCode
            </button>
          </div>
        ))}
      </div>{" "}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Оверлей */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              console.log("Клик по оверлею -> закрыть модалку");
              setShowModal(false);
            }}
          />

          <div className="relative bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-xl p-6 w-full max-w-md shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Добавить проект</h2>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Название проекта"
                className="bg-white/10 dark:bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20"
              />
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="Путь к проекту"
                className="bg-white/10 dark:bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20"
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Описание (необязательно)"
                className="bg-white/10 dark:bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20 h-20"
              />

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  onClick={() => {
                    console.log("Нажата Отмена");
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-md transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition"
                >
                  Добавить
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                console.log("Нажата кнопка закрытия (X)");
                setShowModal(false);
              }}
              className="absolute top-2 right-2 text-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import { invoke } from "@tauri-apps/api/core";
// import { Code, Plus, Folder } from "lucide-react";
// type Project = {
//   id: number;
//   name: string;
//   path: string;
//   description: string;
// };
// type ProjectListProps = {
//   onSelectProject: (projectId: number) => void; // Callback для выбора проекта
// };

// export const ProjectList: React.FC<ProjectListProps> = ({
//   onSelectProject,
// }) => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [newPath, setNewPath] = useState("");
//   const [newDesc, setNewDesc] = useState("");

//   // Загрузка проектов
//   async function loadProjects() {
//     try {
//       const result = await invoke<Project[]>("list_projects");
//       setProjects(result);
//     } catch (err) {
//       console.error("Ошибка при list_projects:", err);
//     }
//   }

//   useEffect(() => {
//     loadProjects();
//   }, []);

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="dashboard-card">
//         <div className="flex items-center justify-between py-2">
//           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//             <Folder className="w-5 h-5" />
//             Список проектов
//           </h2>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-1 bg-green-600 hover:bg-green-500 transition text-white px-1 py-1 rounded-md"
//           >
//             <Plus className="w-5 h-5" />
//           </button>
//         </div>

//         {projects.map((project) => (
//           <div
//             key={project.id}
//             className="mb-4 p-3 bg-white/5 dark:bg-white/10 rounded-md flex flex-col gap-1 cursor-pointer"
//             onClick={() => onSelectProject(project.id)} // Передача ID выбранного проекта
//           >
//             <p className="font-bold">{project.name}</p>
//             <p className="text-xs opacity-70">{project.path}</p>
//             {project.description && (
//               <p className="text-sm">{project.description}</p>
//             )}
//             <button
//               onClick={() => invoke("open_in_vscode", { path: project.path })}
//               className="mt-2 flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-500 transition text-white px-3 py-1 rounded-md"
//             >
//               <Code className="w-4 h-4" />
//               Открыть в VSCode
//             </button>
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setShowModal(false)}
//           />
//           <div className="relative bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-xl p-6 w-full max-w-md shadow-lg z-10">
//             <h2 className="text-xl font-bold mb-4">Добавить проект</h2>
//             <div className="flex flex-col gap-2">
//               <input
//                 type="text"
//                 value={newName}
//                 onChange={(e) => setNewName(e.target.value)}
//                 placeholder="Название проекта"
//                 className="bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20"
//               />
//               <input
//                 type="text"
//                 value={newPath}
//                 onChange={(e) => setNewPath(e.target.value)}
//                 placeholder="Путь к проекту"
//                 className="bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20"
//               />
//               <textarea
//                 value={newDesc}
//                 onChange={(e) => setNewDesc(e.target.value)}
//                 placeholder="Описание (необязательно)"
//                 className="bg-white/10 rounded-md px-3 py-2 text-sm outline-none border border-white/20 h-20"
//               />
//               <div className="flex gap-3 mt-4 justify-end">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-md"
//                 >
//                   Отмена
//                 </button>
//                 <button
//                   onClick={handleAdd}
//                   className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
//                 >
//                   Добавить
//                 </button>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900"
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
