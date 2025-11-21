import z from "zod";

export const surveyFormSchema = z.object({
	// demographic data
	gender: z.enum(["feminino", "masculino"], {
		message: "Selecione seu sexo",
	}),
	age_range: z.enum(["10-11", "12-14", "15-20", "20-30", "40-50", "60-70"], {
		message: "Selecione sua faixa etária",
	}),
	grade: z.enum(["6_ano", "7_ano", "8_ano", "9_ano", "eja"], {
		message: "Selecione sua série",
	}),

	// school meal questions
	eats_school_meal: z.enum(["sim", "nao"], {
		message: "Responda se você come a merenda escolar",
	}),
	meal_frequency: z
		.enum(["1_vez", "2_vezes", "3_vezes", "4_vezes", "todos_dias"], {
			message: "Selecione a frequência",
		})
		.optional(),
	likes_meal: z.enum(["sim", "nao"], {
		message: "Responda se você gosta da merenda",
	}),
	menu_is_varied: z.enum(["sim", "nao"], {
		message: "Responda se o cardápio é variado",
	}),
	wants_to_participate: z.enum(["sim", "nao"], {
		message: "Responda se gostaria de participar",
	}),
	knows_pnae: z.enum(["sim", "nao"], {
		message: "Responda se conhece o PNAE",
	}),
	knows_paa: z.enum(["sim", "nao"], {
		message: "Responda se conhece o PAA",
	}),
	knows_pas: z.enum(["sim", "nao"], {
		message: "Responda se conhece o PAS Nordeste",
	}),

	// regional foods
	favorite_regional_foods: z
		.array(
			z.enum([
				"cuscuz_ovo",
				"feijao_mulatinho",
				"sopa_costela",
				"carne_sol_nata",
				"arroz_leite",
				"pacoca_carne",
			]),
		)
		.min(1, "Selecione pelo menos um alimento regional"),

	// open text response
	ultraprocessed_definition: z.string().optional(),
	identifies_ultraprocessed: z.string().optional(),
	ultraprocessed_health_risks: z.string().optional(),

	// menu suggestions
	favorite_dessert_fruit: z.enum(["banana", "melancia"], {
		message: "Selecione sua fruta favorita para sobremesa",
	}),
	favorite_juice_fruit: z.enum(["manga", "goiaba", "acerola"], {
		message: "Selecione sua fruta favorita para suco",
	}),
	favorite_vegetable: z.enum(["batata_doce", "macaxeira"], {
		message: "Selecione sua hortaliça favorita",
	}),
	favorite_protein: z.enum(["carne", "frango"], {
		message: "Selecione sua proteína favorita",
	}),
});

export type SurveyFormData = z.infer<typeof surveyFormSchema>;
