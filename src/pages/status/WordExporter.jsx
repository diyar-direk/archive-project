import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { dateFormatter } from "../../utils/dateFormatter";
import useLanguage from "../../hooks/useLanguage";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import Loading from "../../components/loading/Loading";

const today = dateFormatter(new Date());

const WordExporter = ({ date, coordinateCount }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const token = context?.userDetails?.token;

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    if (date.from) params.append("createdAt[gte]", date.from);
    if (date.to) params.append("createdAt[lte]", date.to);

    setLoading(true);
    try {
      const [
        departments,
        departmentSections,
        countAnsweredExports,
        exportForRecipient,
      ] = await Promise.all([
        axios.get(`${baseURL}/Statistics/countInformation`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ...params,
            categoryStatistics: "department",
          },
        }),
        axios.get(`${baseURL}/Statistics/departmentInformation`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }),
        axios.get(`${baseURL}/Statistics/countAnsweredExports`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }),
        axios.get(`${baseURL}/Statistics/CountExports`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }),
      ]);

      return {
        departments: departments?.data?.data,
        departmentSections: departmentSections.data.data,
        countAnsweredExports: countAnsweredExports.data.data,
        exportForRecipient: exportForRecipient.data.data,
      };
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, date]);

  const generateDoc = async () => {
    const data = await fetchData();
    if (!data) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph(
              `Data statistics from date ${date.from || "any date"} to date ${
                date.to || today
              }`
            ),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${
                    data?.departments?.length || 0
                  } departments for information`,
                  bold: true,
                }),
              ],
            }),

            ...(data?.departments?.map(
              (department) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${department.infoCount || 0} info for ${
                        department.name
                      }`,
                    }),
                  ],
                })
            ) || []),

            ...(data?.departmentSections?.flatMap((departmentSection) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${
                      departmentSection?.countsForSections?.length || 0
                    } sections for ${departmentSection?.department?.name}`,
                    bold: true,
                  }),
                ],
              }),

              ...(departmentSection?.countsForSections?.map(
                (section) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${section?.count || 0} info for ${
                          section?.sectionName
                        }`,
                      }),
                    ],
                  })
              ) || []),
            ]) || []),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${
                    data?.countAnsweredExports?.length || 0
                  } answered exports`,
                  bold: true,
                }),
              ],
            }),

            ...(data?.countAnsweredExports?.map(
              (answeredExport) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${
                        answeredExport.exportWithAnswersCount || 0
                      } export for ${answeredExport.name}`,
                    }),
                  ],
                })
            ) || []),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${
                    data?.exportForRecipient?.length || 0
                  } exports for recipient`,
                  bold: true,
                }),
              ],
            }),

            ...(data?.exportForRecipient?.map(
              (recipient) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${recipient.exportCount || 0} export for ${
                        recipient.name
                      }`,
                    }),
                  ],
                })
            ) || []),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${coordinateCount || 0} coordinates`,
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "statistics.docx");
  };

  if (loading) return <Loading />;

  return (
    <i
      className="fa-solid fa-file-word"
      onClick={generateDoc}
      title={language?.statistics?.export_as_word}
    />
  );
};

export default WordExporter;
