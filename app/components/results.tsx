"use client";

import { Badge } from "./ui/badge";
import { BarChart } from "./ui/bar-chart";
import { Card, CardDescription, CardTitle } from "./ui/card";
import type { ChartConfig } from "./ui/chart";
import { PieChart } from "./ui/pie-chart";
import { Tab, TabList, TabPanel, Tabs } from "./ui/tabs";

const mockData = {
	totalRespostas: 247,
	demographics: {
		sexo: [
			{ name: "Feminino", value: 132 },
			{ name: "Masculino", value: 115 },
		],
		serie: [
			{ name: "6° Ano", value: 58 },
			{ name: "7° Ano", value: 64 },
			{ name: "8° Ano", value: 52 },
			{ name: "9° Ano", value: 48 },
			{ name: "EJA", value: 25 },
		],
	},
	merenda: {
		comeMerenda: { sim: 198, nao: 49 },
		gostaMerenda: { sim: 156, nao: 91 },
		cardapioVariado: { sim: 112, nao: 135 },
		gostariaParticipar: { sim: 203, nao: 44 },
	},
	alimentosMaisVotados: [
		{ name: "Cuscuz com ovo", votes: 189, percent: 76 },
		{ name: "Carne de sol na nata", votes: 167, percent: 68 },
		{ name: "Arroz de Leite", votes: 143, percent: 58 },
		{ name: "Feijão Mulatinho", votes: 134, percent: 54 },
		{ name: "Paçoca de carne", votes: 98, percent: 40 },
		{ name: "Sopa de Costela", votes: 76, percent: 31 },
	],
	sugestoes: {
		sobremesa: [
			{ name: "Banana", value: 145 },
			{ name: "Melancia", value: 102 },
		],
		suco: [
			{ name: "Acerola", value: 112 },
			{ name: "Manga", value: 89 },
			{ name: "Goiaba", value: 46 },
		],
		hortalica: [
			{ name: "Macaxeira", value: 156 },
			{ name: "Batata doce", value: 91 },
		],
		proteina: [
			{ name: "Frango", value: 154 },
			{ name: "Carne", value: 93 },
		],
	},
};

// Configurações dos gráficos
const serieConfig: ChartConfig = {
	"6° Ano": { label: "6° Ano", color: "chart-1" },
	"7° Ano": { label: "7° Ano", color: "chart-2" },
	"8° Ano": { label: "8° Ano", color: "chart-3" },
	"9° Ano": { label: "9° Ano", color: "chart-4" },
	EJA: { label: "EJA", color: "chart-5" },
};

const sexoConfig: ChartConfig = {
	Feminino: { label: "Feminino", color: "chart-1" },
	Masculino: { label: "Masculino", color: "chart-2" },
};

const sucoConfig: ChartConfig = {
	Acerola: { label: "Acerola", color: "chart-1" },
	Manga: { label: "Manga", color: "chart-2" },
	Goiaba: { label: "Goiaba", color: "chart-3" },
};

const sobremesaConfig: ChartConfig = {
	Banana: { label: "Banana", color: "chart-1" },
	Melancia: { label: "Melancia", color: "chart-2" },
};

const hortalicaConfig: ChartConfig = {
	Macaxeira: { label: "Macaxeira", color: "chart-1" },
	"Batata doce": { label: "Batata doce", color: "chart-2" },
};

const proteinaConfig: ChartConfig = {
	Frango: { label: "Frango", color: "chart-1" },
	Carne: { label: "Carne", color: "chart-2" },
};

// Transformar dados para os gráficos
const serieData = mockData.demographics.serie.map((item) => ({
	name: item.name,
	[item.name]: item.value,
}));

const sexoData = mockData.demographics.sexo.map((item) => ({
	name: item.name,
	code: item.name,
	value: item.value,
}));

const sucoData = mockData.sugestoes.suco.map((item) => ({
	name: item.name,
	[item.name]: item.value,
}));

const sobremesaData = mockData.sugestoes.sobremesa.map((item) => ({
	name: item.name,
	code: item.name,
	value: item.value,
}));

const hortalicaData = mockData.sugestoes.hortalica.map((item) => ({
	name: item.name,
	code: item.name,
	value: item.value,
}));

const proteinaData = mockData.sugestoes.proteina.map((item) => ({
	name: item.name,
	code: item.name,
	value: item.value,
}));

export function Results() {
	return (
		<div>
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<Card className="p-4">
					<div className="flex flex-col gap-2">
						<div>
							<CardTitle>Resultados da Pesquisa</CardTitle>
						</div>

						<CardDescription>
							Cardápio Escolar - Plataforma Colaborativa
						</CardDescription>
					</div>

					<Badge className="w-fit">
						{mockData.totalRespostas} respostas coletadas
					</Badge>
				</Card>

				{/* Tabs */}
				<Tabs defaultSelectedKey="geral" className="w-full">
					<TabList className="overflow-x-auto">
						<Tab id="geral">Visão Geral</Tab>
						<Tab id="mais-votados">Mais Votados</Tab>
						<Tab id="sugestoes">Sugestões</Tab>
					</TabList>

					{/* Visão Geral */}
					<TabPanel id="geral">
						<div className="space-y-6">
							{/* Cards de Resumo */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<Card className="bg-white rounded-lg shadow p-4">
									<CardTitle className="text-2xl font-bold text-green-600">
										<i className="mr-2">🍽️</i>
										{Math.round(
											(mockData.merenda.comeMerenda.sim /
												mockData.totalRespostas) *
												100,
										)}
										%
									</CardTitle>
									<CardDescription>Comem merenda</CardDescription>
								</Card>

								<Card className="bg-white rounded-lg shadow p-4">
									<CardTitle className="text-2xl font-bold text-blue-600">
										<i className="mr-2">😊</i>
										{Math.round(
											(mockData.merenda.gostaMerenda.sim /
												mockData.totalRespostas) *
												100,
										)}
										%
									</CardTitle>
									<CardDescription className="text-sm text-gray-600">
										Gostam da merenda
									</CardDescription>
								</Card>

								<div className="bg-white rounded-lg shadow p-4">
									<div className="text-3xl mb-2">🗳️</div>
									<div className="text-2xl font-bold text-purple-600">
										{Math.round(
											(mockData.merenda.gostariaParticipar.sim /
												mockData.totalRespostas) *
												100,
										)}
										%
									</div>
									<div className="text-sm text-gray-600">Querem participar</div>
								</div>
								<div className="bg-white rounded-lg shadow p-4">
									<div className="text-3xl mb-2">📋</div>
									<div className="text-2xl font-bold text-orange-600">
										{Math.round(
											(mockData.merenda.cardapioVariado.nao /
												mockData.totalRespostas) *
												100,
										)}
										%
									</div>
									<div className="text-sm text-gray-600">
										Querem mais variedade
									</div>
								</div>
							</div>

							{/* Gráficos Demográficos */}
							<div className="bg-white rounded-lg shadow-lg p-6">
								<h2 className="text-xl font-bold text-gray-800 mb-4">
									👥 Perfil dos Participantes
								</h2>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h3 className="font-semibold text-gray-700 mb-3">
											Distribuição por Série
										</h3>
										<div className="h-64">
											<BarChart
												data={serieData}
												dataKey="name"
												config={serieConfig}
												hideXAxis={false}
												hideYAxis={false}
												hideGridLines={false}
											/>
										</div>
									</div>
									<div>
										<h3 className="font-semibold text-gray-700 mb-3">
											Distribuição por Sexo
										</h3>
										<div className="h-64">
											<PieChart
												data={sexoData}
												dataKey="value"
												nameKey="name"
												config={sexoConfig}
												variant="pie"
												showLabel={false}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>

					{/* Mais Votados */}
					<TabPanel id="mais-votados">
						<div className="space-y-6">
							<div className="bg-white rounded-lg shadow-lg p-6">
								<h2 className="text-xl font-bold text-gray-800 mb-2">
									🏆 Alimentos Regionais Mais Votados
								</h2>
								<p className="text-gray-600 mb-6">
									Preferências dos estudantes sobre o cardápio atual
								</p>

								<div className="space-y-4">
									{mockData.alimentosMaisVotados.map((alimento, index) => (
										<div key={alimento.name} className="relative">
											<div className="flex items-center justify-between mb-2">
												<div className="flex items-center gap-3">
													<span className="text-2xl font-bold text-gray-300">
														#{index + 1}
													</span>
													<span className="font-semibold text-gray-800">
														{alimento.name}
													</span>
												</div>
												<div className="text-right">
													<div className="font-bold text-lg text-green-600">
														{alimento.votes}
													</div>
													<div className="text-sm text-gray-500">votos</div>
												</div>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
												<div
													className={`h-full rounded-full flex items-center justify-end pr-3 text-white font-semibold transition-all duration-500 ${
														index === 0
															? "bg-yellow-500"
															: index === 1
																? "bg-gray-400"
																: index === 2
																	? "bg-orange-600"
																	: "bg-green-500"
													}`}
													style={{ width: `${alimento.percent}%` }}
												>
													{alimento.percent}%
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Destaque do Vencedor */}
							<div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
								<div className="text-center">
									<div className="text-6xl mb-3">🏆</div>
									<h3 className="text-2xl font-bold mb-2">Campeão Absoluto!</h3>
									<p className="text-3xl font-bold mb-1">
										{mockData.alimentosMaisVotados[0].name}
									</p>
									<p className="text-xl opacity-90">
										{mockData.alimentosMaisVotados[0].votes} votos (
										{mockData.alimentosMaisVotados[0].percent}% dos
										participantes)
									</p>
								</div>
							</div>
						</div>
					</TabPanel>

					{/* Sugestões */}
					<TabPanel id="sugestoes">
						<div className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								{/* Sobremesa */}
								<div className="bg-white rounded-lg shadow-lg p-6">
									<h3 className="text-lg font-bold text-gray-800 mb-4">
										🍌 Fruta para Sobremesa
									</h3>
									<div className="h-64">
										<PieChart
											data={sobremesaData}
											dataKey="value"
											nameKey="name"
											config={sobremesaConfig}
											variant="donut"
											showLabel={false}
										/>
									</div>
								</div>

								{/* Suco */}
								<div className="bg-white rounded-lg shadow-lg p-6">
									<h3 className="text-lg font-bold text-gray-800 mb-4">
										🧃 Fruta para Suco
									</h3>
									<div className="h-64">
										<BarChart
											data={sucoData}
											dataKey="name"
											config={sucoConfig}
											hideXAxis={false}
											hideYAxis={false}
										/>
									</div>
								</div>

								{/* Hortaliça */}
								<div className="bg-white rounded-lg shadow-lg p-6">
									<h3 className="text-lg font-bold text-gray-800 mb-4">
										🥔 Hortaliça Preferida
									</h3>
									<div className="h-64">
										<PieChart
											data={hortalicaData}
											dataKey="value"
											nameKey="name"
											config={hortalicaConfig}
											variant="donut"
											showLabel={false}
										/>
									</div>
								</div>

								{/* Proteína */}
								<div className="bg-white rounded-lg shadow-lg p-6">
									<h3 className="text-lg font-bold text-gray-800 mb-4">
										🍗 Proteína Preferida
									</h3>
									<div className="h-64">
										<PieChart
											data={proteinaData}
											dataKey="value"
											nameKey="name"
											config={proteinaConfig}
											variant="donut"
											showLabel={false}
										/>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>
				</Tabs>

				{/* Footer */}
				<div className="bg-white rounded-lg shadow-lg p-4 mt-6 text-center text-sm text-gray-500">
					Dados atualizados em tempo real • Última atualização:{" "}
					{new Date().toLocaleDateString("pt-BR")}
				</div>
			</div>
		</div>
	);
}
