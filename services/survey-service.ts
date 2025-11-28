import { unstable_cache } from "next/cache";
import type { SurveyFormData } from "@/domain/entities/survey-form-entity";
import { SurveyRepository } from "../repositories/survey-repository";

const repository = new SurveyRepository();

export class SurveyService {
	async submitSurvey(data: SurveyFormData) {
		return await repository.create(data);
	}

	async getDashboardData() {
		const totalRespostas = await repository.getTotalCount();

		const [
			sexoGroup,
			idadeGroup,
			serieGroup,
			merendaGroup,
			frequenciaGroup,
			gostaGroup,
			variadoGroup,
			participarGroup,
			pnaeGroup,
			paaGroup,
			pasGroup,
			sobremesaGroup,
			sucoGroup,
			hortalicaGroup,
			proteinaGroup,
			regionalFoodsRaw,
		] = await Promise.all([
			repository.getGroupByField("gender"),
			repository.getGroupByField("age_range"),
			repository.getGroupByField("grade"),
			repository.getGroupByField("eats_school_meal"),
			repository.getGroupByField("meal_frequency"),
			repository.getGroupByField("likes_meal"),
			repository.getGroupByField("menu_is_varied"),
			repository.getGroupByField("wants_to_participate"),
			repository.getGroupByField("knows_pnae"),
			repository.getGroupByField("knows_paa"),
			repository.getGroupByField("knows_pas"),
			repository.getGroupByField("favorite_dessert_fruit"),
			repository.getGroupByField("favorite_juice_fruit"),
			repository.getGroupByField("favorite_vegetable"),
			repository.getGroupByField("favorite_protein"),
			repository.getAllRegionalFoods(),
		]);

		const formatGroup = (group: any[]) => {
			const result: Record<string, number> = {};

			group.forEach((item) => {
				const fieldKey = Object.keys(item).find((k) => k !== "_count");

				if (fieldKey) {
					const value = item[fieldKey];
					if (value !== null && value !== undefined) {
						const cleanKey = String(value).toLowerCase();
						result[cleanKey] = item._count._all;
					}
				}
			});
			return result;
		};

		const foodCounts: Record<string, number> = {};
		regionalFoodsRaw.forEach((row) => {
			row.favorite_regional_foods.forEach((food) => {
				foodCounts[food] = (foodCounts[food] || 0) + 1;
			});
		});

		const alimentosMaisVotados = Object.entries(foodCounts)
			.map(([name, votes]) => ({
				name: this.formatFoodName(name),
				votes,
				percent:
					totalRespostas > 0 ? Math.round((votes / totalRespostas) * 100) : 0,
			}))
			.sort((a, b) => b.votes - a.votes);

		return {
			totalRespostas,
			demographics: {
				sexo: sexoGroup.map((i: any) => ({
					name: i.gender === "feminino" ? "Feminino" : "Masculino",
					value: i._count._all,
				})),
				idade: idadeGroup.map((i: any) => ({
					name: this.formatIdadeRange(i.age_range),
					value: i._count._all,
				})),
				serie: serieGroup.map((i: any) => ({
					name: i.grade.replace(/_/g, "° ").replace("eja", "EJA"),
					value: i._count._all,
				})),
			},
			merenda: {
				comeMerenda: formatGroup(merendaGroup),
				frequencia: formatGroup(frequenciaGroup),
				gostaMerenda: formatGroup(gostaGroup),
				cardapioVariado: formatGroup(variadoGroup),
				gostariaParticipar: formatGroup(participarGroup),
			},
			programas: {
				pnae: formatGroup(pnaeGroup),
				paa: formatGroup(paaGroup),
				pas: formatGroup(pasGroup),
			},
			alimentosMaisVotados,
			sugestoes: {
				sobremesa: sobremesaGroup.map((i: any) => ({
					name: this.formatFruitName(i.favorite_dessert_fruit),
					value: i._count._all,
				})),
				suco: sucoGroup.map((i: any) => ({
					name: this.formatFruitName(i.favorite_juice_fruit),
					value: i._count._all,
				})),
				hortalica: hortalicaGroup.map((i: any) => ({
					name: this.formatVegetableName(i.favorite_vegetable),
					value: i._count._all,
				})),
				proteina: proteinaGroup.map((i: any) => ({
					name: this.formatProteinName(i.favorite_protein),
					value: i._count._all,
				})),
			},
		};
	}

	private formatFoodName(key: string): string {
		const map: Record<string, string> = {
			cuscuz_ovo: "Cuscuz com ovo",
			feijao_mulatinho: "Feijão Mulatinho",
			sopa_costela: "Sopa de Costela",
			carne_sol_nata: "Carne de sol na nata",
			arroz_leite: "Arroz de Leite",
			pacoca_carne: "Paçoca de carne",
		};
		return map[key] || key;
	}

	private formatIdadeRange(range: string): string {
		return range.replace("-", " a ") + " anos";
	}

	private formatFruitName(key: string): string {
		const map: Record<string, string> = {
			banana: "Banana",
			melancia: "Melancia",
			manga: "Manga",
			goiaba: "Goiaba",
			acerola: "Acerola",
		};
		return map[key] || key;
	}

	private formatVegetableName(key: string): string {
		const map: Record<string, string> = {
			batata_doce: "Batata doce",
			macaxeira: "Macaxeira",
		};
		return map[key] || key;
	}

	private formatProteinName(key: string): string {
		const map: Record<string, string> = {
			carne: "Carne",
			frango: "Frango",
		};
		return map[key] || key;
	}
}

const serviceInstance = new SurveyService();

export const getCachedDashboardData = unstable_cache(
	async () => {
		console.info("🔄 Cache reativado: recalculando dados no banco...");
		return await serviceInstance.getDashboardData();
	},
	["dashboard-results"],
	{
		revalidate: 60,
		tags: ["dashboard-results"],
	},
);
