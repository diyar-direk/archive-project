import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { dateFormatter } from "../../utils/dateFormatter";
import useLanguage from "../../hooks/useLanguage";

const today = dateFormatter(new Date());

const WordExporter = ({
  date,
  dataCount,
  dataWhitPageinations,
  totalCategoriesCount,
  totalAddressCount,
}) => {
  const { language } = useLanguage();
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
                  text: `. ${totalAddressCount} addresses:`,
                  bold: true,
                }),
              ],
            }),

            // Categories
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${totalCategoriesCount} categories:`,
                  bold: true,
                }),
              ],
            }),

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
        title={language?.statistics.export_as_word}
      />
    </div>
  );
};

export default WordExporter;
