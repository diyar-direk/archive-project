import JSZip from "jszip";
import { saveAs } from "file-saver";
import { AlignmentType, Document, Packer, Paragraph, TextRun } from "docx";
import { mediaURL } from "../../context/context";

const exportDataAsZip = async (data) => {
  const zip = new JSZip();
  const createParagraph = (label, value) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: `${label}:`,
          bold: true,
        }),
        new TextRun({
          text: value || "No results found",
          break: 1,
        }),
      ],
    });
  };
  const createArrayParagraph = (label, data) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: `${label}: `,
          bold: true,
        }),
        ...(data?.length > 0
          ? data.map(
              (e) =>
                new TextRun({
                  text: e.name
                    ? e.name
                    : e.coordinates
                    ? e.coordinates
                    : e.source_name
                    ? e.source_name
                    : `${e.firstName} ${e.fatherName} ${e.surName}`,
                  break: 1,
                })
            )
          : [
              new TextRun({
                text: "No results found",
                break: 1,
              }),
            ]),
      ],
    });
  };

  // **📄 إنشاء ملف Word (DOCX) يحتوي على التفاصيل**
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: "portrait",
            },
            rtl: false,
          },
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: data.subject || "No Subject",
                size: 48,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          createParagraph("Details", data.details),
          createParagraph("Note", data.note),
          createParagraph("Country", data.countryId?.name),
          createParagraph("City", data.cityId?.name),
          createParagraph("Government", data.governmentId?.name),
          createParagraph("Region", data.regionId?.name),
          createParagraph("Street", data.streetId?.name),
          createParagraph("Village", data.villageId?.name),
          createParagraph("Address Details", data.addressDetails),
          createArrayParagraph("coordinates", data.coordinates),
          createArrayParagraph("people", data.people),
          createArrayParagraph("events", data.events),
          createArrayParagraph("parties", data.parties),
          createArrayParagraph("sources", data.sources),
        ],
      },
    ],
  });

  // **📂 تحويل مستند Word إلى Blob وإضافته إلى الـ ZIP**
  const blob = await Packer.toBlob(doc);

  // **📌 حل مشكلة عدم القدرة على التعديل**
  const newBlob = new Blob([blob], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  zip.file("Details.docx", newBlob); // ✅ استخدام `new Blob()` لحل المشكلة

  // **📂 تحميل الوسائط وإضافتها إلى الـ ZIP**
  const addFileToZip = async (folder, files) => {
    if (!files || files.length === 0) return;

    await Promise.all(
      files.map(async (file) => {
        try {
          const fileName = file.src.split("/").pop();
          const fileUrl = mediaURL + file.src;

          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);

          const fileBlob = await response.blob();
          folder.file(fileName, fileBlob);
        } catch (error) {
          console.error(" خطأ في تحميل الملف:", error);
        }
      })
    );
  };

  // **📂 إضافة الوسائط إلى مجلدات منفصلة**

  const mediaFolders = {
    images: zip.folder("Images"),
    videos: zip.folder("Videos"),
    documents: zip.folder("Documents"),
    audios: zip.folder("Audios"),
  };

  // إضافة الصور
  addFileToZip(mediaFolders.images, data.media.images);

  // إضافة الفيديوهات
  addFileToZip(mediaFolders.videos, data.media.videos);

  // إضافة المستندات
  addFileToZip(mediaFolders.documents, data.media.documents);

  // إضافة الملفات الصوتية
  addFileToZip(mediaFolders.audios, data.media.audios);

  // **📥 إنشاء وتحميل ملف ZIP**
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, `${data.subject}.zip`);
  });
};

// **📌 استخدام الزر في React**
export default function ExportButton({ data }) {
  return (
    <button onClick={() => exportDataAsZip(data)}>📥 تنزيل البيانات</button>
  );
}
