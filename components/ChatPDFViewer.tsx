import React from "react";

type Props = { pdf_url: string };

const ChatPDFViewer = ({ pdf_url }: Props) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(pdf_url)}&embedded=true`}
        className="w-full h-full border-none"
        title="PDF Viewer"
      ></iframe>
    </div>
  );
};

export default ChatPDFViewer;