'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.querySelector('.sidebar')?.classList.toggle('translate-x-full');
  };

  return (
    <button
      onClick={toggleSidebar}
      className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-l-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
    </button>
  );
};

export default SidebarToggle;