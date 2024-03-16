import React from 'react';
import logo from '@assets/img/logo.svg';

export default function Popup(): JSX.Element {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <h1>D-Day</h1>
      </header>
    </div>
  );
}