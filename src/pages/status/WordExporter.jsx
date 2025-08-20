import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { dateFormatter } from "../../utils/dateFormatter";
import useLanguage from "../../hooks/useLanguage";

const today = dateFormatter(new Date());

const WordExporter = ({
  date,
  dataCount,
  dataWhitPageinations,
  sectionsCount,
}) => {
  const { language } = useLanguage();

  const calcTotal = (items) =>
    Object.keys(items).reduce((acc, key) => acc + (dataCount[key] || 0), 0);

  const generateSection = (title, items, total = null) => {
    if (!items) return [];
    const content = [];

    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `. ${total ?? calcTotal(items)} ${title}:`,
            bold: true,
            break: 1,
          }),
        ],
      })
    );

    content.push(
      ...Object.entries(items).map(
        ([key, value]) =>
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${dataCount[key] ?? 0} ${value}`,
              }),
            ],
          })
      )
    );

    return content;
  };

  const generateDoc = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph(
              `Data statistics from date ${date.form || "any date"} to date ${
                date.to || today
              }`
            ),

            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${dataCount.informationCount} ${language?.statistics?.information}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${dataCount.personCount} ${language?.statistics?.people}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `. ${dataCount.coordinateCount} ${language?.statistics?.coordinates}`,
                  bold: true,
                }),
              ],
            }),

            ...generateSection(
              language?.statistics?.adress_information,
              sectionsCount.addressesEnum
            ),
            ...generateSection(
              language?.statistics?.categories,
              sectionsCount.categoriesEnum
            ),
            ...generateSection(
              language?.header?.outgoing_incoming,
              sectionsCount.incomingCount
            ),
            ...generateSection(
              language?.header?.outgoing_incoming,
              sectionsCount.reportAndResultCount
            ),

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
    <i
      className="fa-solid fa-file-word"
      onClick={generateDoc}
      title={language?.statistics?.export_as_word}
    />
  );
};

export default WordExporter;
