import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { dateFormatter } from "../../utils/dateFormatter";
import { useMemo } from "react";

const today = dateFormatter(new Date());

const WordExporter = ({ date, dataCount, dataEnum, dataWhitPageinations }) => {
  const totalDataCount = useMemo(() => {
    const totalAddressCount = Object.entries(dataEnum.addressesEnum).reduce(
      (total, [key]) => total + (dataCount[key] || 0),
      0
    );
    const totalCategoriesCount = Object.entries(dataEnum.categoriesEnum).reduce(
      (total, [key]) => total + (dataCount[key] || 0),
      0
    );
    return { totalAddressCount, totalCategoriesCount };
  }, [dataEnum, dataCount]);

  const generateDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph(
              `data statistics from date ${date.form || "any date"} to date ${
                date.to || today
              }`
            ),

            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${dataCount.informationCount} informations`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${dataCount.personCount} person`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${dataCount.coordinateCount} coordinates`,
                  bold: true,
                }),
              ],
            }),

            // Addresses
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${totalDataCount.totalAddressCount} addresses:`,
                  bold: true,
                }),
              ],
            }),
            ...Object.entries(dataEnum.addressesEnum).map(
              ([key, label]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `. ${dataCount[key] || 0} ${label}` }),
                  ],
                })
            ),

            // Categories
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${totalDataCount.totalCategoriesCount} categories:`,
                  bold: true,
                }),
              ],
            }),
            ...Object.entries(dataEnum.categoriesEnum).map(
              ([key, label]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `. ${dataCount[key] || 0} ${label}` }),
                  ],
                })
            ),

            // 👇 This is the NEW part to export section/source/event/party
            ...Object.entries(dataWhitPageinations).flatMap(([key, items]) => {
              if (!Array.isArray(items) || items.length === 0) return [];

              return [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `. ${key.toUpperCase()} statistics:`,
                      bold: true,
                      break: 1,
                    }),
                  ],
                }),
                ...items.map(
                  (item) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `• ${item.name}: ${item.infoCount}`,
                        }),
                      ],
                    })
                ),
              ];
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "statistics.docx");
  };

  return (
    <div className="export-as-word flex">
      <i
        className="fa-solid fa-download"
        onClick={generateDoc}
        title="export as word file"
      />
    </div>
  );
};

export default WordExporter;
