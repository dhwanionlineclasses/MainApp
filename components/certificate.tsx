import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

type CertificateProps = {
  studentName: string;
  parentName: string;
  grade: string;
  instrument: string;
  rollNo: number;
  date: string;
};

export default function Certificate({
  studentName,
  parentName,
  grade,
  instrument,
  rollNo,
  date,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("certificate.pdf");
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div
        ref={certRef}
        className="relative w-[1000px] h-[700px] rounded-lg overflow-hidden border"
        style={{
          backgroundImage: "url('/certificate.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "'Dancing Script', cursive", // use cursive font
          color: "#000000", // pure black
        }}
      >
        {/* Student Name */}
        <div className="absolute top-[320px] left-[450px] text-xl font-bold">
          {studentName}
        </div>

        {/* Parent Name */}
        <div className="absolute top-[357px] left-[400px] text-xl">
          {parentName}
        </div>

        {/* Grade */}
        <div className="absolute top-[428px] left-[490px] text-lg">
          {grade}
        </div>

        {/* Instrument */}
        <div className="absolute top-[394px] left-[380px] text-xl">
          {instrument}
        </div>

        {/* Roll No */}
        <div className="absolute bottom-[120px] left-[190px] text-lg">
          {rollNo}
        </div>

        {/* Date */}
        <div className="absolute bottom-[95px] left-[190px] text-lg">
          {date}
        </div>
      </div>

      {/* <Button onClick={handleDownload}>Download</Button> */}
    </div>
  );
}
