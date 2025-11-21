import { NextResponse } from "next/server";
import { getCachedDashboardData } from "../../../services/survey-service";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const data = await getCachedDashboardData();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Erro ao buscar resultados:", error);
		return NextResponse.json(
			{ message: "Erro ao carregar resultados" },
			{ status: 500 },
		);
	}
}
