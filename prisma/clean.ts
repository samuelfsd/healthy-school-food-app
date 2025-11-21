import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
	if (process.env.DATABASE_URL?.includes("prod")) {
		console.error("🚨 ERRO: Tentando limpar banco de PRODUÇÃO! Abortando.");
		process.exit(1);
	}

	console.log("xau registros...");
	await prisma.tb_survey_responses.deleteMany({});
	console.log("limpeza finalizada com sucesso!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
