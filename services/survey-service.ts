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
			serieGroup,
			merendaGroup,
			gostaGroup,
			variadoGroup,
			participarGroup,
			regionalFoodsRaw,
		] = await Promise.all([
			repository.getGroupByField("gender"),
			repository.getGroupByField("grade"),
			repository.getGroupByField("eats_school_meal"),
			repository.getGroupByField("likes_meal"),
			repository.getGroupByField("menu_is_varied"),
			repository.getGroupByField("wants_to_participate"),
			repository.getAllRegionalFoods(),
		]);

		const formatGroup = (group: any[]) => {
			const result: Record<string, number> = {};

			group.forEach((item) => {
				const fieldKey = Object.keys(item).find((k) => k !== "_count");

				if (fieldKey) {
					const value = item[fieldKey];
					const cleanKey = String(value).toLowerCase();
					result[cleanKey] = item._count._all;
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
				serie: serieGroup.map((i: any) => ({
					name: i.grade.replace(/_/g, "° ").replace("eja", "EJA"),
					value: i._count._all,
				})),
			},
			merenda: {
				comeMerenda: formatGroup(merendaGroup),
				gostaMerenda: formatGroup(gostaGroup),
				cardapioVariado: formatGroup(variadoGroup),
				gostariaParticipar: formatGroup(participarGroup),
			},
			alimentosMaisVotados,
			sugestoes: await this.getSugestoesData(),
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

	private async getSugestoesData() {
		return {
			sobremesa: [],
			suco: [],
			hortalica: [],
			proteina: [],
		};
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
