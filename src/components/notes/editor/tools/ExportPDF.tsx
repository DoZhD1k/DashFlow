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

// // @ts-ignore
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import { FileText } from "lucide-react";
// import { FC } from "react";
// import { Editor } from "@tiptap/react";

// interface ExportPDFButtonProps {
//   editor: Editor | null;
// }

// const ExportPDFButton: FC<ExportPDFButtonProps> = ({ editor }) => {
//   const handleExport = async () => {
//     if (!editor) {
//       console.error("Редактор не инициализирован.");
//       return;
//     }

//     const contentElement = document.querySelector(
//       ".ProseMirror"
//     ) as HTMLElement;
//     if (!contentElement) {
//       console.error("Не найден элемент .ProseMirror");
//       return;
//     }

//     // Создаем клон контента для экспорта
//     const clonedElement = contentElement.cloneNode(true) as HTMLElement;
//     clonedElement.style.backgroundColor = "white";
//     clonedElement.style.color = "black";

//     // Удаляем классы темной темы
//     clonedElement.classList.remove("dark");
//     clonedElement.querySelectorAll("*").forEach((el) => {
//       el.classList.remove("dark");
//       (el as HTMLElement).style.backgroundColor = "white";
//       (el as HTMLElement).style.color = "black";
//     });

//     document.body.appendChild(clonedElement); // Добавляем клон в DOM (временно)

//     try {
//       // Создаем изображение с содержимым
//       const canvas = await html2canvas(clonedElement, {
//         scale: 2,
//         backgroundColor: "#ffffff",
//         useCORS: true,
//       });

//       const imgData = canvas.toDataURL("image/png");

//       // Создаем PDF-документ
//       const pdf = new jsPDF({
//         format: "a4",
//         orientation: "portrait",
//         unit: "mm",
//       });

//       const imgWidth = 210; // A4 ширина в мм
//       const pageHeight = 297; // A4 высота в мм
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let y = 10;
//       pdf.addImage(imgData, "PNG", 10, y, imgWidth - 20, imgHeight);

//       // Сохраняем PDF
//       pdf.save("note.pdf");
//     } catch (error) {
//       console.error("Ошибка при генерации PDF:", error);
//     } finally {
//       document.body.removeChild(clonedElement); // Убираем временный клон
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
// import autoTable from "jspdf-autotable";
// import { FileText } from "lucide-react";
// import { FC } from "react";
// import { Editor } from "@tiptap/react";

// // Функция для конвертации ArrayBuffer → Base64
// const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
//   let binary = "";
//   const bytes = new Uint8Array(buffer);
//   for (let i = 0; i < bytes.byteLength; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// };

// // Проверка выхода за границы страницы
// const checkPageOverflow = (pdf: jsPDF, y: number, margin: number = 10) => {
//   if (y + margin >= pdf.internal.pageSize.height - 10) {
//     pdf.addPage();
//     return 10;
//   }
//   return y;
// };

// interface ExportPDFButtonProps {
//   editor: Editor | null;
// }

// const ExportPDFButton: FC<ExportPDFButtonProps> = ({ editor }) => {
//   const handleExport = async () => {
//     if (!editor) {
//       console.error("Редактор не инициализирован.");
//       return;
//     }

//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     // 🔥 Загружаем шрифт для поддержки русского языка
//     const fontUrl = "/fonts/DejaVuSans.ttf"; // Должен лежать в `public/fonts`
//     const fontBinary = await fetch(fontUrl).then((res) => res.arrayBuffer());
//     const fontBase64 = arrayBufferToBase64(fontBinary);

//     pdf.addFileToVFS("DejaVuSans.ttf", fontBase64);
//     pdf.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
//     pdf.setFont("DejaVuSans");

//     let y = 10;
//     const contentJSON = editor.getJSON();
//     if (!contentJSON || !contentJSON.content) {
//       console.error("Ошибка: Пустой контент");
//       return;
//     }

//     // Функция обработки контента
//     const processNode = (node: any) => {
//       if (!node.content || node.content.length === 0) return;

//       y = checkPageOverflow(pdf, y);

//       if (node.type === "heading") {
//         pdf.setFontSize(
//           node.attrs.level === 1 ? 22 : node.attrs.level === 2 ? 18 : 16
//         );
//         pdf.setFont("DejaVuSans", "bold");
//         pdf.text(node.content[0]?.text || "", 10, y);
//         y += 10;
//       } else if (node.type === "paragraph") {
//         pdf.setFontSize(12);
//         pdf.setFont("DejaVuSans", "normal");

//         let text = "";
//         let highlight = false;

//         node.content?.forEach((span: any) => {
//           let style = "normal";
//           if (span.marks) {
//             span.marks.forEach((mark: any) => {
//               if (mark.type === "bold") style = "bold";
//               if (mark.type === "italic") style = "italic";
//               if (mark.type === "highlight") highlight = true;
//             });
//           }

//           pdf.setFont("DejaVuSans", style);
//           if (highlight) {
//             pdf.setFillColor(255, 255, 0);
//             pdf.rect(10, y - 4, pdf.getTextWidth(span.text) + 2, 6, "F");
//           }
//           text += span.text + " ";
//         });

//         pdf.text(text.trim(), 10, y);
//         y += 6;
//       } else if (node.type === "codeBlock") {
//         if (node.content && node.content[0]?.text) {
//           pdf.setFont("Courier", "normal");
//           pdf.setFontSize(10);
//           pdf.setFillColor(240, 240, 240);

//           y = checkPageOverflow(
//             pdf,
//             y,
//             node.content[0].text.split("\n").length * 5 + 8
//           );

//           pdf.rect(
//             10,
//             y - 4,
//             190,
//             node.content[0].text.split("\n").length * 5 + 4,
//             "F"
//           );

//           node.content[0].text.split("\n").forEach((line: string) => {
//             pdf.text(line, 12, y);
//             y += 5;
//           });

//           y += 5;
//         }
//       } else if (node.type === "table") {
//         const tableData: any[] = [];
//         const tableHeaders: any[] = [];

//         node.content.forEach((row: any, rowIndex: number) => {
//           const rowData: any[] = [];
//           row.content.forEach((cell: any) => {
//             rowData.push(cell.content?.[0]?.content?.[0]?.text || "");
//           });

//           if (rowIndex === 0) {
//             tableHeaders.push(rowData);
//           } else {
//             tableData.push(rowData);
//           }
//         });

//         y = checkPageOverflow(pdf, y, tableData.length * 6 + 10);

//         autoTable(pdf, {
//           startY: y,
//           head: tableHeaders,
//           body: tableData,
//           styles: {
//             fontSize: 10,
//             font: "DejaVuSans",
//             cellPadding: 3,
//             lineWidth: 0.4,
//             lineColor: [0, 0, 0],
//           },
//           headStyles: {
//             fillColor: [220, 220, 220],
//             textColor: 0,
//             fontStyle: "bold",
//           },
//           alternateRowStyles: { fillColor: [245, 245, 245] },
//         });

//         y = (pdf as any).previousAutoTable.finalY + 10;
//       }
//     };

//     contentJSON.content.forEach(processNode);
//     pdf.save("note.pdf");
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
