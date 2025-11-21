"use client";

import { useEffect, useState } from "react";
import {
	Bar,
	CartesianGrid,
	Cell,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { DashboardData } from "@/domain/entities/result-entity";
import { Badge } from "./ui/badge";
import { Card, CardDescription, CardTitle } from "./ui/card";
import type { ChartConfig } from "./ui/chart";
import { Loader } from "./ui/loader";
import { PieChart } from "./ui/pie-chart";
import { Tab, TabList, TabPanel, Tabs } from "./ui/tabs";

const initialData: DashboardData = {
	totalRespostas: 0,
	demographics: { sexo: [], serie: [] },
	merenda: {
		comeMerenda: {},
		gostaMerenda: {},
		cardapioVariado: {},
		gostariaParticipar: {},
	},
	alimentosMaisVotados: [],
	sugestoes: { sobremesa: [], suco: [], hortalica: [], proteina: [] },
};

const serieConfig: ChartConfig = {
	"6° ano": { label: "6° Ano", color: "#2563eb" },
	"7° ano": { label: "7° Ano", color: "#16a34a" },
	"8° ano": { label: "8° Ano", color: "#dc2626" },
	"9° ano": { label: "9° Ano", color: "#9333ea" },
	EJA: { label: "EJA", color: "#f59e0b" },
};

const sexoConfig: ChartConfig = {
	Feminino: { label: "Feminino", color: "#ec4899" },
	Masculino: { label: "Masculino", color: "#3b82f6" },
};

const rankingColors = [
	"bg-yellow-500", // 1º - ouro
	"bg-slate-400", // 2º - prata
	"bg-amber-600", // 3º - bronze
	"bg-blue-600", // 4º
	"bg-purple-600", // 5º
	"bg-pink-600", // 6º
	"bg-teal-600", // 7º
	"bg-indigo-600", // 8º
	"bg-rose-600", // 9º
	"bg-cyan-600", // 10º
];

export function ResultsData() {
	const [data, setData] = useState<DashboardData>(initialData);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/results", {
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Falha ao carregar dados");
				}

				const jsonData = await response.json();
				setData(jsonData);
			} catch (err) {
				console.error(err);
				setError("Não foi possível carregar os resultados agora.");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const orderMap: Record<string, number> = {
		"6° ano": 1,
		"7° ano": 2,
		"8° ano": 3,
		"9° ano": 4,
		eja: 5,
		EJA: 5,
	};

	const serieData = data.demographics.serie
		.map((item) => {
			const key = item.name.toLowerCase();
			const configItem = serieConfig[item.name] || serieConfig[key];

			return {
				name: item.name,
				value: item.value,
				fill: configItem?.color || "#94a3b8",
			};
		})
		.sort((a, b) => {
			const orderA = orderMap[a.name] || orderMap[a.name.toLowerCase()] || 99;
			const orderB = orderMap[b.name] || orderMap[b.name.toLowerCase()] || 99;
			return orderA - orderB;
		});

	const sexoData = data.demographics.sexo.map((item: any) => ({
		name: item.name,
		value: item.value,
		fill: item.name === "Feminino" ? "#ec4899" : "#3b82f6",
	}));

	const calcPercent = (val: number | undefined) => {
		if (!val || data.totalRespostas === 0) return 0;

		return Math.round((val / data.totalRespostas) * 100);
	};

	if (loading) {
		return (
			<div className="flex h-[50vh] w-full items-center justify-center">
				<div className="text-lg text-gray-500 animate-pulse flex items-center gap-4">
					<Loader /> Carregando...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[50vh] w-full items-center justify-center text-red-500">
				{error}
			</div>
		);
	}

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

					<Badge className="w-fit mt-2">
						{data.totalRespostas} respostas coletadas
					</Badge>
				</Card>

				{/* Tabs */}
				<Tabs defaultSelectedKey="geral" className="w-full mt-6">
					<TabList className="overflow-x-auto">
						<Tab id="geral">Visão Geral</Tab>
						<Tab id="mais-votados">Mais Votados</Tab>
					</TabList>

					{/* Visão Geral */}
					<TabPanel id="geral">
						<div className="space-y-6 mt-4">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<Card className="bg-white rounded-lg shadow p-4">
									<CardTitle className="text-2xl font-bold text-green-600">
										<i className="mr-2 not-italic">🍽️</i>
										{calcPercent(data.merenda.comeMerenda.sim)}%
									</CardTitle>
									<CardDescription>Comem merenda</CardDescription>
								</Card>

								<Card className="bg-white rounded-lg shadow p-4">
									<CardTitle className="text-2xl font-bold text-blue-600">
										<i className="mr-2 not-italic">😊</i>
										{calcPercent(data.merenda.gostaMerenda.sim)}%
									</CardTitle>
									<CardDescription className="text-sm text-gray-600">
										Gostam da merenda
									</CardDescription>
								</Card>

								<Card className="bg-white rounded-lg shadow p-4 border">
									<CardTitle className="text-2xl font-bold text-purple-600">
										<i className="mr-2 not-italic">🗳️</i>
										{calcPercent(data.merenda.gostariaParticipar.sim)}%
									</CardTitle>
									<CardDescription className="text-sm text-gray-600">
										Querem participar
									</CardDescription>
								</Card>

								<Card className="bg-white rounded-lg shadow p-4 border">
									<CardTitle className="text-2xl font-bold text-orange-600">
										<i className="mr-2 not-italic">📋</i>
										{calcPercent(data.merenda.cardapioVariado.nao)}%
									</CardTitle>
									<CardDescription className="text-sm text-gray-600">
										Querem mais variedade
									</CardDescription>
								</Card>
							</div>

							{/* Gráficos Demográficos */}
							<div className="bg-white rounded-lg shadow-lg p-6 border">
								<h2 className="text-xl font-bold text-gray-800 mb-4">
									Perfil dos Participantes
								</h2>
								<div className="grid md:grid-cols-2 gap-6">
									<div className="bg-white p-6">
										<h3 className="font-semibold text-gray-700 mb-6 text-center">
											Participação por Série
										</h3>

										<div className="h-[300px] w-full min-h-[300px]">
											{serieData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart
														data={serieData}
														margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
													>
														<CartesianGrid
															vertical={false}
															strokeDasharray="3 3"
															stroke="#e5e7eb"
														/>

														<XAxis
															dataKey="name"
															tickLine={false}
															axisLine={false}
															tickMargin={10}
															tick={{ fill: "#6b7280", fontSize: 12 }}
														/>

														<YAxis
															tickLine={false}
															axisLine={false}
															tick={{ fill: "#6b7280", fontSize: 12 }}
														/>

														<Tooltip
															cursor={{ fill: "#f3f4f6" }}
															contentStyle={{
																borderRadius: "8px",
																border: "none",
																boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
															}}
														/>

														<Bar
															dataKey="value"
															radius={[4, 4, 0, 0]}
															maxBarSize={60}
															name="total"
														>
															{serieData.map((entry) => (
																<Cell
																	key={`cell-${entry.name}`}
																	fill={entry.fill}
																/>
															))}
														</Bar>
													</RechartsBarChart>
												</ResponsiveContainer>
											) : (
												<div className="flex h-full items-center justify-center text-gray-400">
													Sem dados suficientes.
												</div>
											)}
										</div>
									</div>

									<div className="flex flex-col h-full">
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Distribuição por Sexo
										</h3>
										<div className="flex-1 flex items-center justify-center w-full min-h-[200px]">
											{sexoData.length > 0 ? (
												<div className="w-full max-w-[300px] aspect-square relative">
													<PieChart
														data={sexoData}
														dataKey="value"
														nameKey="name"
														config={sexoConfig}
														variant="donut"
														showLabel={false}
													/>
												</div>
											) : (
												<div className="flex h-full w-full items-center justify-center py-8">
													<p className="text-sm text-gray-400">
														Sem dados suficientes.
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>

					{/* Mais Votados */}
					<TabPanel id="mais-votados">
						<div className="space-y-4">
							{data.alimentosMaisVotados.length === 0 && (
								<p className="text-gray-500 italic">
									Ainda não há votos registrados.
								</p>
							)}

							{data.alimentosMaisVotados.map((alimento, index) => {
								const barColorClass =
									rankingColors[index % rankingColors.length];

								return (
									<div key={alimento.name} className="relative">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-3">
												<span
													className={`text-2xl font-bold ${index < 3 ? "text-gray-700" : "text-gray-400"}`}
												>
													#{index + 1}
												</span>
												<span className="font-semibold text-gray-800">
													{alimento.name}
												</span>
											</div>
											<div className="text-right">
												<div className="font-bold text-lg text-gray-700">
													{alimento.votes}
												</div>
												<div className="text-sm text-gray-500">votos</div>
											</div>
										</div>
										<div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner">
											<div
												className={`h-full rounded-full flex items-center justify-end pr-3 text-white font-bold text-sm transition-all duration-1000 ease-out ${barColorClass} ${index === 0 ? "shadow-md shadow-yellow-200/50" : ""}`}
												style={{ width: `${alimento.percent}%` }}
											>
												{alimento.percent > 0 ? `${alimento.percent}%` : ""}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</TabPanel>
				</Tabs>

				{/* Footer */}
				<div className="bg-white rounded-lg shadow-lg p-4 mt-6 text-center text-sm text-gray-500 border">
					Dados atualizados em tempo real • Total de participações:{" "}
					{data.totalRespostas}
				</div>
			</div>
		</div>
	);
}
