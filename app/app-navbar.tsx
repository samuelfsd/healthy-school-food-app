"use client";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import {
	Navbar,
	NavbarGap,
	NavbarItem,
	NavbarMobile,
	type NavbarProps,
	NavbarProvider,
	NavbarSection,
	NavbarStart,
	NavbarTrigger,
} from "@/components/ui/navbar";

export default function AppNavbar(props: NavbarProps) {
	return (
		<NavbarProvider>
			<Navbar {...props}>
				<NavbarStart>
					<div className="flex items-center gap-2">
						<ClipboardDocumentCheckIcon className="h-6 w-6" />

						<span>
							Cardápio <span className="font-bold">Escolar</span>
						</span>
					</div>
				</NavbarStart>
				<NavbarGap />
				<NavbarSection>
					<NavbarItem href="/" isCurrent>
						Home
					</NavbarItem>
					<NavbarItem href="/about">Sobre</NavbarItem>
					<NavbarItem href="/result">Resultados</NavbarItem>
					<NavbarItem href="/politicas">Políticas</NavbarItem>
				</NavbarSection>
			</Navbar>

			<NavbarMobile>
				<NavbarTrigger />
			</NavbarMobile>
		</NavbarProvider>
	);
}
