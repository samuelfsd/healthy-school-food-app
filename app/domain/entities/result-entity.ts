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
		serie: DemographicItem[];
	};
	merenda: {
		comeMerenda: GroupData;
		gostaMerenda: GroupData;
		cardapioVariado: GroupData;
		gostariaParticipar: GroupData;
	};
	alimentosMaisVotados: FoodVote[];
	sugestoes: {
		sobremesa: DemographicItem[];
		suco: DemographicItem[];
		hortalica: DemographicItem[];
		proteina: DemographicItem[];
	};
}
