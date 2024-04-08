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
      <body>
        <NavBar children={children} />
      </body>
    </html>
  );
}
