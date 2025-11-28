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
	demographics: { sexo: [], idade: [], serie: [] },
	merenda: {
		comeMerenda: {},
		frequencia: {},
		gostaMerenda: {},
		cardapioVariado: {},
		gostariaParticipar: {},
	},
	programas: { pnae: {}, paa: {}, pas: {} },
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

const idadeConfig: ChartConfig = {
	"10 a 11 anos": { label: "10-11", color: "#06b6d4" },
	"12 a 14 anos": { label: "12-14", color: "#8b5cf6" },
	"15 a 20 anos": { label: "15-20", color: "#10b981" },
	"20 a 30 anos": { label: "20-30", color: "#f59e0b" },
	"40 a 50 anos": { label: "40-50", color: "#ef4444" },
	"60 a 70 anos": { label: "60-70", color: "#6366f1" },
};

const frequenciaConfig: ChartConfig = {
	"1_vez": { label: "1x/semana", color: "#dc2626" },
	"2_vezes": { label: "2x/semana", color: "#f59e0b" },
	"3_vezes": { label: "3x/semana", color: "#eab308" },
	"4_vezes": { label: "4x/semana", color: "#84cc16" },
	todos_dias: { label: "Todos os dias", color: "#22c55e" },
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

	const idadeData = data.demographics.idade.map((item: any) => ({
		name: item.name,
		value: item.value,
		fill: idadeConfig[item.name]?.color || "#94a3b8",
	}));

	const frequenciaData = Object.entries(data.merenda.frequencia || {}).map(
		([key, value]) => ({
			name: frequenciaConfig[key]?.label || key,
			value,
			fill: frequenciaConfig[key]?.color || "#94a3b8",
		}),
	);

	const sobremesaData = data.sugestoes.sobremesa.map((item: any) => ({
		name: item.name,
		value: item.value,
		fill: "#f97316",
	}));

	const sucoData = data.sugestoes.suco.map((item: any) => ({
		name: item.name,
		value: item.value,
		fill: "#06b6d4",
	}));

	const hortalicaData = data.sugestoes.hortalica.map((item: any) => ({
		name: item.name,
		value: item.value,
		fill: "#22c55e",
	}));

	const proteinaData = data.sugestoes.proteina.map((item: any) => ({
		name: item.name,
		value: item.value,
		fill: "#dc2626",
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

				<Tabs defaultSelectedKey="geral" className="w-full mt-6">
					<TabList className="overflow-x-auto">
						<Tab id="geral">Visão Geral</Tab>
						<Tab id="demograficos">Perfil</Tab>
						<Tab id="programas">Programas</Tab>
						<Tab id="sugestoes">Sugestões</Tab>
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

							{/* Gráficos de Merenda */}
							<div className="bg-white rounded-lg shadow-lg p-6 border">
								<h2 className="text-xl font-bold text-gray-800 mb-4">
									Consumo da Merenda Escolar
								</h2>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Come Merenda Escolar?
										</h3>
										<div className="h-[250px] flex items-center justify-center">
											{Object.keys(data.merenda.comeMerenda).length > 0 ? (
												<div className="w-full max-w-[300px] aspect-square relative">
													<PieChart
														data={[
															{
																name: "Sim",
																value: data.merenda.comeMerenda.sim || 0,
																fill: "#22c55e",
															},
															{
																name: "Não",
																value: data.merenda.comeMerenda.nao || 0,
																fill: "#ef4444",
															},
														]}
														dataKey="value"
														nameKey="name"
														config={{
															Sim: { label: "Sim", color: "#22c55e" },
															Não: { label: "Não", color: "#ef4444" },
														}}
														variant="donut"
														showLabel={false}
													/>
												</div>
											) : (
												<div className="text-gray-400">Sem dados</div>
											)}
										</div>
									</div>

									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Frequência Semanal
										</h3>
										<div className="h-[250px]">
											{frequenciaData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart
														data={frequenciaData}
														margin={{ top: 20, right: 0, left: -10, bottom: 0 }}
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
															tick={{ fill: "#6b7280", fontSize: 10 }}
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
															maxBarSize={50}
															name="total"
														>
															{frequenciaData.map((entry) => (
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
													Sem dados
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Perfil dos Participantes */}
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

					{/* Perfil Demográfico */}
					<TabPanel id="demograficos">
						<div className="space-y-6 mt-4">
							<div className="bg-white rounded-lg shadow-lg p-6 border">
								<h2 className="text-xl font-bold text-gray-800 mb-6">
									Dados Demográficos
								</h2>

								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Distribuição por Idade
										</h3>
										<div className="h-[300px]">
											{idadeData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart
														data={idadeData}
														margin={{
															top: 20,
															right: 0,
															left: -30,
															bottom: 20,
														}}
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
															tick={{ fill: "#6b7280", fontSize: 10 }}
															angle={-45}
															textAnchor="end"
														/>
														<YAxis
															tickLine={false}
															axisLine={false}
															tick={{ fill: "#6b7280", fontSize: 12 }}
														/>
														<Tooltip />
														<Bar
															dataKey="value"
															radius={[4, 4, 0, 0]}
															maxBarSize={50}
															name="total"
														>
															{idadeData.map((entry) => (
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
													Sem dados
												</div>
											)}
										</div>
									</div>

									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Frequência da Merenda
										</h3>
										<div className="h-[300px]">
											{frequenciaData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart
														data={frequenciaData}
														margin={{ top: 20, right: 0, left: -10, bottom: 0 }}
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
															tick={{ fill: "#6b7280", fontSize: 11 }}
														/>
														<YAxis
															tickLine={false}
															axisLine={false}
															tick={{ fill: "#6b7280", fontSize: 12 }}
														/>
														<Tooltip />
														<Bar
															dataKey="value"
															radius={[4, 4, 0, 0]}
															maxBarSize={50}
															name="total"
														>
															{frequenciaData.map((entry) => (
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
													Sem dados
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>

					{/* Programas */}
					<TabPanel id="programas">
						<div className="space-y-6 mt-4">
							<div className="bg-white rounded-lg shadow-lg p-6 border">
								<h2 className="text-xl font-bold text-gray-800 mb-6">
									Conhecimento sobre Programas
								</h2>

								<div className="grid gap-6">
									<Card className="p-4 border-l-4 border-l-blue-500">
										<CardTitle className="text-lg mb-2">
											PNAE - Programa Nacional de Alimentação Escolar
										</CardTitle>
										<div className="flex gap-8 mt-4">
											<div className="text-center">
												<div className="text-3xl font-bold text-green-600">
													{calcPercent(data.programas.pnae.sim)}%
												</div>
												<div className="text-sm text-gray-600">Conhecem</div>
											</div>
											<div className="text-center">
												<div className="text-3xl font-bold text-red-600">
													{calcPercent(data.programas.pnae.nao)}%
												</div>
												<div className="text-sm text-gray-600">
													Não conhecem
												</div>
											</div>
										</div>
									</Card>

									<Card className="p-4 border-l-4 border-l-purple-500">
										<CardTitle className="text-lg mb-2">
											PAA - Programa de Aquisição de Alimentos
										</CardTitle>
										<div className="flex gap-8 mt-4">
											<div className="text-center">
												<div className="text-3xl font-bold text-green-600">
													{calcPercent(data.programas.paa.sim)}%
												</div>
												<div className="text-sm text-gray-600">Conhecem</div>
											</div>
											<div className="text-center">
												<div className="text-3xl font-bold text-red-600">
													{calcPercent(data.programas.paa.nao)}%
												</div>
												<div className="text-sm text-gray-600">
													Não conhecem
												</div>
											</div>
										</div>
									</Card>

									<Card className="p-4 border-l-4 border-l-orange-500">
										<CardTitle className="text-lg mb-2">
											PAS - Programa de Alimentação Saudável Nordeste
										</CardTitle>
										<div className="flex gap-8 mt-4">
											<div className="text-center">
												<div className="text-3xl font-bold text-green-600">
													{calcPercent(data.programas.pas.sim)}%
												</div>
												<div className="text-sm text-gray-600">Conhecem</div>
											</div>
											<div className="text-center">
												<div className="text-3xl font-bold text-red-600">
													{calcPercent(data.programas.pas.nao)}%
												</div>
												<div className="text-sm text-gray-600">
													Não conhecem
												</div>
											</div>
										</div>
									</Card>
								</div>
							</div>
						</div>
					</TabPanel>

					{/* Sugestões */}
					<TabPanel id="sugestoes">
						<div className="space-y-6 mt-4">
							<div className="bg-white rounded-lg shadow-lg p-6 border">
								<h2 className="text-xl font-bold text-gray-800 mb-6">
									Preferências para Cardápio
								</h2>

								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Frutas - Sobremesa
										</h3>
										<div className="h-[250px]">
											{sobremesaData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart data={sobremesaData}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="name" />
														<YAxis />
														<Tooltip />
														<Bar
															name="total"
															dataKey="value"
															radius={[4, 4, 0, 0]}
														>
															{sobremesaData.map((entry) => (
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
													Sem dados
												</div>
											)}
										</div>
									</div>

									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Frutas - Sucos
										</h3>
										<div className="h-[250px]">
											{sucoData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart data={sucoData}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="name" />
														<YAxis />
														<Tooltip />
														<Bar
															name="total"
															dataKey="value"
															radius={[4, 4, 0, 0]}
														>
															{sucoData.map((entry) => (
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
													Sem dados
												</div>
											)}
										</div>
									</div>

									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Hortaliças Preferidas
										</h3>
										<div className="h-[250px]">
											{hortalicaData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart data={hortalicaData}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="name" />
														<YAxis />
														<Tooltip />
														<Bar
															name="total"
															dataKey="value"
															radius={[4, 4, 0, 0]}
														>
															{hortalicaData.map((entry) => (
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
													Sem dados
												</div>
											)}
										</div>
									</div>

									<div>
										<h3 className="font-semibold text-gray-700 mb-4 text-center">
											Proteínas Preferidas
										</h3>
										<div className="h-[250px]">
											{proteinaData.length > 0 ? (
												<ResponsiveContainer width="100%" height="100%">
													<RechartsBarChart data={proteinaData}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="name" />
														<YAxis />
														<Tooltip />
														<Bar
															name="total"
															dataKey="value"
															radius={[4, 4, 0, 0]}
														>
															{proteinaData.map((entry, index) => (
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
													Sem dados
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

				<div className="bg-white rounded-lg shadow-lg p-4 mt-6 text-center text-sm text-gray-500 border">
					Dados atualizados em tempo real • Total de participações:{" "}
					{data.totalRespostas}
				</div>
			</div>
		</div>
	);
}
