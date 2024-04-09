"use server;"

import * as React from 'react';
import { Inter } from "next/font/google";
import NavBar from './navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MaestroWorfoce",
  description: "Where management is made easier",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='bg-[#e6e4f1] h-screen'>
        <NavBar children={children} />
      </body>
    </html>
  );
}
