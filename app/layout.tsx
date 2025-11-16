import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppNavbar from "./app-navbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Plataforma Colaborativa - Cardápio Escolar",
	description: "Uma plataforma colaborativa de gestão de cardápio escolar.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body
				className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppNavbar intent="float" />

				<main>{children}</main>
			</body>
		</html>
	);
}
