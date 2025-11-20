"use client";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
	const pathname = usePathname();
	const isActive = (href: string) => pathname === href;

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
					<NavbarItem isCurrent={isActive("/")}>
						<Link href="/">Home</Link>
					</NavbarItem>
					<NavbarItem isCurrent={isActive("/results")}>
						<Link href="/results">Resultados</Link>
					</NavbarItem>
				</NavbarSection>
			</Navbar>
			<NavbarMobile>
				<NavbarTrigger />
			</NavbarMobile>
		</NavbarProvider>
	);
}
