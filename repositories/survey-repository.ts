import type { SurveyFormData } from "@/domain/entities/survey-form-entity";
import { prisma } from "../lib/prisma";

export class SurveyRepository {
	async create(data: SurveyFormData) {
		return await prisma.tb_survey_responses.create({
			data: {
				...data,
			},
		});
	}

	async getTotalCount() {
		return await prisma.tb_survey_responses.count();
	}

	async getGroupByField(field: keyof typeof prisma.tb_survey_responses.fields) {
		return await prisma.tb_survey_responses.groupBy({
			by: [field],
			_count: {
				_all: true,
			},
		});
	}

	async getAllRegionalFoods() {
		return await prisma.tb_survey_responses.findMany({
			select: {
				favorite_regional_foods: true,
			},
		});
	}
}
