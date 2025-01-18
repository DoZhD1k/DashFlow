import React from "react";
import { ProjectList } from "~/components/projects/ProjectList";
import { Todos } from "~/components/projects/Todos";
import { AdditionalBlocks } from "~/components/projects/AdditionalBlocks";

export const Projects: React.FC = () => {
  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Проекты</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectList />

        <Todos />

        <AdditionalBlocks />
      </div>
    </div>
  );
};
