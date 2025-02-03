// @ts-ignore
import html2pdf from "html2pdf.js";

// Функция для экспорта контента в PDF
export const exportToPDF = (contentElement: HTMLElement): void => {
  if (!contentElement) {
    console.error("Content element is not defined.");
    return;
  }

  // Настройки для html2pdf
  const options = {
    margin: 10,
    filename: "note.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: {
      unit: "mm",
      format: "tabloid", // Формат страницы
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"], // Избегать обрезки содержимого
    },
  };

  // Генерация PDF
  html2pdf()
    .set(options)
    .from(contentElement)
    .save()
    .catch((error: unknown) => {
      console.error("Ошибка генерации PDF:", error);
    });
};

// Пример кнопки для вызова экспорта
import React from "react";
import { FileText } from "lucide-react";

interface ExportPDFButtonProps {
  editor: any; // Если тип редактора известен, замени 'any' на точный тип.
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ editor }) => {
  const handleExport = (): void => {
    if (!editor) return;

    const contentElement = document.querySelector(
      ".ProseMirror"
    ) as HTMLElement; // Явно указываем тип
    if (contentElement) {
      exportToPDF(contentElement);
    } else {
      console.error("ProseMirror content element not found.");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition dark:hover:bg-stone-600"
      title="Экспортировать в PDF"
    >
      <FileText className="w-4 h-4" />
    </button>
  );
};

export default ExportPDFButton;
