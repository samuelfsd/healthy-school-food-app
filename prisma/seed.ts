import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

const getRandomItem = <T>(items: T[]): T =>
	items[Math.floor(Math.random() * items.length)];

const getRandomSubArray = <T>(items: T[], maxItems: number = 3): T[] => {
	const shuffled = [...items].sort(() => 0.5 - Math.random());
	const count = Math.floor(Math.random() * maxItems) + 1;
	return shuffled.slice(0, count);
};

const OPTIONS = {
	gender: ["feminino", "masculino"],
	age_range: ["10-11", "12-14", "15-20", "20-30", "40-50", "60-70"],
	grade: ["6_ano", "7_ano", "8_ano", "9_ano", "eja"],
	yes_no: ["sim", "nao"],
	frequencies: ["1_vez", "2_vezes", "3_vezes", "4_vezes", "todos_dias"],
	regional_foods: [
		"cuscuz_ovo",
		"feijao_mulatinho",
		"sopa_costela",
		"carne_sol_nata",
		"arroz_leite",
		"pacoca_carne",
	],
	fruits_dessert: ["banana", "melancia"],
	fruits_juice: ["manga", "goiaba", "acerola"],
	vegetables: ["batata_doce", "macaxeira"],
	proteins: ["carne", "frango"],
};

async function main() {
	console.log("🌱 Iniciando o seed do banco de dados...");

	// 1. Limpar banco anterior (Opcional, mas bom para testes limpos)
	await prisma.tb_survey_responses.deleteMany();
	console.log("🧹 Banco limpo.");

	// 2. Gerar 150 respostas fake
	const AMOUNT_TO_CREATE = 150;
	const dataToInsert = [];

	for (let i = 0; i < AMOUNT_TO_CREATE; i++) {
		// Lógica simples de consistência: Se não come merenda, frequência pode ser null
		const eatsMeal = getRandomItem(OPTIONS.yes_no);
		const mealFreq =
			eatsMeal === "sim" ? getRandomItem(OPTIONS.frequencies) : null;

		dataToInsert.push({
			gender: getRandomItem(OPTIONS.gender),
			age_range: getRandomItem(OPTIONS.age_range),
			grade: getRandomItem(OPTIONS.grade),

			eats_school_meal: eatsMeal,
			meal_frequency: mealFreq,
			likes_meal: getRandomItem(OPTIONS.yes_no),
			menu_is_varied: getRandomItem(OPTIONS.yes_no),
			wants_to_participate: getRandomItem(OPTIONS.yes_no),

			knows_pnae: getRandomItem(OPTIONS.yes_no),
			knows_paa: getRandomItem(OPTIONS.yes_no),
			knows_pas: getRandomItem(OPTIONS.yes_no),

			// Array de strings para o Mongo
			favorite_regional_foods: getRandomSubArray(OPTIONS.regional_foods),

			// Textos abertos (Lorem ipsum simples)
			ultraprocessed_definition: "Alimentos com muitos aditivos químicos.",
			identifies_ultraprocessed: "Salsicha, refrigerante, salgadinho.",
			ultraprocessed_health_risks: "Obesidade, diabetes e hipertensão.",

			favorite_dessert_fruit: getRandomItem(OPTIONS.fruits_dessert),
			favorite_juice_fruit: getRandomItem(OPTIONS.fruits_juice),
			favorite_vegetable: getRandomItem(OPTIONS.vegetables),
			favorite_protein: getRandomItem(OPTIONS.proteins),
		});
	}

	// 3. Inserção em massa (Muito mais rápido que loop de create)
	await prisma.tb_survey_responses.createMany({
		data: dataToInsert,
	});

	console.log(`✅ Seed finalizado! ${AMOUNT_TO_CREATE} registros criados.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
