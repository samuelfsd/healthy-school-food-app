"use client";

export function Footer() {
	return (
		<footer className="fixed inset-x-0 bottom-0 bg-neutral-primary-soft rounded-base shadow-xs border rounded-lg m-4">
			<div className="w-full mx-auto p-4 md:flex md:items-center md:justify-between">
				<span className="text-sm text-body sm:text-center">
					© {new Date().getFullYear()}{" "}
					<a
						href="https://www.linkedin.com/in/samuelfsd/"
						className="hover:underline"
					>
						Samuel Alves Medeiros
					</a>
					. Todos os direitos reservados.
				</span>
				<ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
					<li>
						<a href="/" className="hover:underline me-4 md:me-6">
							Sobre
						</a>
					</li>
					<li>
						<a href="/" className="hover:underline me-4 md:me-6">
							Resultados
						</a>
					</li>
					<li>
						<a href="/" className="hover:underline me-4 md:me-6">
							Políticas
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
}
