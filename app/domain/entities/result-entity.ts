export interface DemographicItem {
	name: string;
	value: number;
}

export interface GroupData {
	[key: string]: number;
}

export interface FoodVote {
	name: string;
	votes: number;
	percent: number;
}

export interface DashboardData {
	totalRespostas: number;
	demographics: {
		sexo: DemographicItem[];
		idade: DemographicItem[];
		serie: DemographicItem[];
	};
	merenda: {
		comeMerenda: GroupData;
		frequencia: GroupData;
		gostaMerenda: GroupData;
		cardapioVariado: GroupData;
		gostariaParticipar: GroupData;
	};
	programas: {
		pnae: GroupData;
		paa: GroupData;
		pas: GroupData;
	};
	alimentosMaisVotados: FoodVote[];
	sugestoes: {
		sobremesa: DemographicItem[];
		suco: DemographicItem[];
		hortalica: DemographicItem[];
		proteina: DemographicItem[];
	};
}
