"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: '#F9F6FF', // Light Purple
            color: '#3F2965', // Dark Purple
            border: '1px solid #3F2965',
            fontWeight: 'bold',
          },
          iconTheme: {
            primary: '#Dd1764', // Pink Checkmark
            secondary: '#F9F6FF',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#FFF5F5',
            color: '#C53030',
            border: '1px solid #C53030',
            fontWeight: 'bold',
          },
        },
      }}
    />
  );
}