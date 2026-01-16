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
        
        className: '',
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },

        
        success: {
          duration: 3000,
          style: {
            background: '#F9F6FF', 
            color: '#3F2965', 
            border: '1px solid #3F2965',
            fontWeight: 'bold',
          },
          iconTheme: {
            primary: '#Dd1764', 
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