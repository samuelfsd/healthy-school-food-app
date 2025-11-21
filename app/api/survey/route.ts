import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { surveyFormSchema } from "@/domain/entities/survey-form-entity";
import { SurveyService } from "../../../services/survey-service";

const service = new SurveyService();

export async function POST(request: Request) {
	try {
		const body = await request.json();

		const validatedData = surveyFormSchema.parse(body);

		await service.submitSurvey(validatedData);
		revalidateTag("dashboard-results", "max");

		return NextResponse.json(
			{ message: "Resposta enviada com sucesso" },
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ errors: error.issues }, { status: 400 });
		}
		console.error(error);
		return NextResponse.json(
			{ message: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
