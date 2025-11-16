import { PrincipalForm } from "./components/principal-form-questions";
import { Container } from "./components/ui/container";

export default function Home() {
	return (
		<Container className="py-6 sm:py-12">
			<PrincipalForm />
		</Container>
	);
}
