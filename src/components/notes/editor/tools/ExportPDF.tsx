// // @ts-ignore
// import html2pdf from "html2pdf.js";

// // Функция для экспорта контента в PDF
// export const exportToPDF = (contentElement: HTMLElement): void => {
//   if (!contentElement) {
//     console.error("Content element is not defined.");
//     return;
//   }

//   // Настройки для html2pdf
//   const options = {
//     margin: 10,
//     filename: "note.pdf",
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: {
//       unit: "mm",
//       format: "tabloid", // Формат страницы
//       orientation: "portrait",
//     },
//     pagebreak: {
//       mode: ["avoid-all", "css", "legacy"], // Избегать обрезки содержимого
//     },
//   };

//   // Генерация PDF
//   html2pdf()
//     .set(options)
//     .from(contentElement)
//     .save()
//     .catch((error: unknown) => {
//       console.error("Ошибка генерации PDF:", error);
//     });
// };

// // Пример кнопки для вызова экспорта
// import React from "react";
// import { FileText } from "lucide-react";

// interface ExportPDFButtonProps {
//   editor: any; // Если тип редактора известен, замени 'any' на точный тип.
// }

// const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ editor }) => {
//   const handleExport = (): void => {
//     if (!editor) return;

//     const contentElement = document.querySelector(
//       ".ProseMirror"
//     ) as HTMLElement; // Явно указываем тип
//     if (contentElement) {
//       exportToPDF(contentElement);
//     } else {
//       console.error("ProseMirror content element not found.");
//     }
//   };

//   return (
//     <button
//       onClick={handleExport}
//       className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition dark:hover:bg-stone-600"
//       title="Экспортировать в PDF"
//     >
//       <FileText className="w-4 h-4" />
//     </button>
//   );
// };

// export default ExportPDFButton;

// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { FileText } from "lucide-react";
// import RobotoBase64 from "../utils/RobotoBase64"; // Импортируем закодированный шрифт

// export const exportToPDF = (editor: any): void => {
//   if (!editor) {
//     console.error("Editor is not defined.");
//     return;
//   }

//   // Создаем новый PDF документ
//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a4",
//   });

//   // Загружаем кастомный шрифт (Roboto, поддерживает кириллицу)
//   doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
//   doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
//   doc.setFont("Roboto");

//   // Устанавливаем размер шрифта
//   doc.setFontSize(14);

//   // Получаем текст из редактора
//   const contentHtml = editor.getHTML();
//   const tempDiv = document.createElement("div");
//   tempDiv.innerHTML = contentHtml;
//   const contentText = tempDiv.innerText || tempDiv.textContent || "";

//   // Разбиваем текст на строки
//   const maxWidth = 180;
//   const lineHeight = 7;
//   const startX = 15;
//   let startY = 30;

//   const textLines: string[] = doc.splitTextToSize(contentText, maxWidth);
//   textLines.forEach((line: string) => {
//     if (startY > 280) {
//       doc.addPage();
//       startY = 20;
//     }
//     doc.text(line, startX, startY);
//     startY += lineHeight;
//   });

//   // Сохранение файла
//   doc.save("note.pdf");
// };

// interface ExportPDFButtonProps {
//   editor: any; // Если знаешь точный тип редактора, замени any
// }

// const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ editor }) => {
//   const handleExport = (): void => {
//     if (!editor) return;
//     exportToPDF(editor);
//   };

//   return (
//     <button
//       onClick={handleExport}
//       className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition dark:hover:bg-stone-600"
//       title="Экспортировать в PDF"
//     >
//       <FileText className="w-4 h-4" />
//     </button>
//   );
// };

// export default ExportPDFButton;

// @ts-ignore
// import React from "react";
import html2pdf from "html2pdf.js";
import { FileText } from "lucide-react";

export const exportToPDF = (editor: any): void => {
  if (!editor) {
    console.error("Editor is not defined.");
    return;
  }

  const contentElement = document.querySelector(".ProseMirror") as HTMLElement;
  if (!contentElement) {
    console.error("ProseMirror content element not found.");
    return;
  }

  // **Сохраняем оригинальные стили перед изменением**
  const originalBackground = contentElement.style.backgroundColor;
  const originalColor = contentElement.style.color;

  // **Принудительно устанавливаем белый фон и чёрный текст**
  contentElement.style.backgroundColor = "#ffffff"; // Белый фон
  contentElement.style.color = "#000000"; // Чёрный текст

  // **Опции для html2pdf**
  const options = {
    margin: 10,
    filename: "note.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  // **Генерация PDF**
  html2pdf()
    .set(options)
    .from(contentElement)
    .save()
    .then(() => {
      // **ВОССТАНАВЛИВАЕМ оригинальные стили после скачивания**
      contentElement.style.backgroundColor = originalBackground;
      contentElement.style.color = originalColor;
    })
    .catch((error: unknown) => {
      console.error("Ошибка генерации PDF:", error);

      // **Если ошибка, тоже восстанавливаем стили**
      contentElement.style.backgroundColor = originalBackground;
      contentElement.style.color = originalColor;
    });
};

interface ExportPDFButtonProps {
  editor: any; // Если знаешь точный тип редактора, замени any
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ editor }) => {
  const handleExport = (): void => {
    if (!editor) return;
    exportToPDF(editor);
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
