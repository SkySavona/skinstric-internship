"use client";

import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-30 w-full h-14 flex items-center justify-between mx-auto max-w-[2560px] px-4 sm:px-6 md:px-8 bg-white text-gray-900 shadow">
      <div className="flex items-center">
        <a href="/" className="text-lg font-bold text-black no-underline" style={{ clipPath: 'inset(0%)' }}>
          SKINSTRIC
        </a>
      </div>
      <div className="flex items-center">
        <button className="text-button bg-blue-700 text-white uppercase font-bold py-2 px-4 rounded-md hover:bg-blue-800 transition">
          Consult Chemist
        </button>
      </div>
    </header>
  );
};

export default Header;
