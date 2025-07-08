import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  let title = "Terjadi kesalahan tak terduga.";
  let status = "500";
  let statusText = "Internal Server Error";

  if (isRouteErrorResponse(error)) {
    status = error.status.toString();
    statusText = error.statusText;
    title = `${status} - ${statusText}`;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-red-50 via-white to-blue-50 flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="text-7xl mb-4">🚨</div>
        <h1 className="text-5xl font-bold text-red-600 mb-2">{status}</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {statusText}
        </h2>
        <p className="text-gray-600 mb-6">{title}</p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
