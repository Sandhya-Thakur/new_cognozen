import React from "react";
import WebcamAnalyzer from "@/components/WebCamComponenet";
import { Save} from "lucide-react";
import Link from "next/link";

const SidebarContent: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
      <div className="bg-gray-100 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Webcam</h2>
        <WebcamAnalyzer />
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
          <Save className="mr-2" size={18} />
          Save Notes
        </button>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex-grow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
        <textarea
          className="w-full h-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Take notes here..."
        />
      </div>
 
    </div>
  );
};

export default SidebarContent;
