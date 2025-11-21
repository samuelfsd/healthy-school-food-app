"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FieldError, Fieldset, Label, Legend } from "@/components/ui/field";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import type { SurveyFormData } from "@/domain/entities/survey-form-entity";
import { surveyFormSchema } from "@/domain/entities/survey-form-entity";
import { Checkbox, CheckboxGroup } from "./ui/checkbox";
import { Radio, RadioGroup } from "./ui/radio";
import { Textarea } from "./ui/textarea";

export function PrincipalForm() {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			gender: "",
			age_range: "",
			grade: "",
			eats_school_meal: "",
			meal_frequency: undefined,
			likes_meal: "",
			menu_is_varied: "",
			wants_to_participate: "",
			knows_pnae: "",
			knows_paa: "",
			knows_pas: "",
			favorite_regional_foods: [],
			ultraprocessed_definition: "",
			identifies_ultraprocessed: "",
			ultraprocessed_health_risks: "",
			favorite_dessert_fruit: "",
			favorite_juice_fruit: "",
			favorite_vegetable: "",
			favorite_protein: "",
		} as unknown as SurveyFormData,
		onSubmit: async ({ value }) => {
			if (value.eats_school_meal === "sim" && !value.meal_frequency) {
				alert(
					"Por favor, selecione a frequência da merenda quando informado que come a merenda escolar.",
				);

				return;
			}

			try {
				const parsed = surveyFormSchema.parse(value);

				const response = await fetch("/api/survey", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(parsed),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Erro ao enviar");
				}

				form.reset();
				router.push("/results");
			} catch (err) {
				if (err instanceof z.ZodError) {
					console.error("Erros de validação:", err.issues);
					alert(err.issues.map((i) => i.message).join(""));
				} else {
					console.error(err);
					alert("Erro ao enviar formulário. Tente novamente.");
				}
			}
		},
	});

	const makeFieldValidator = <K extends keyof SurveyFormData>(
		schema: z.ZodTypeAny,
	) => {
		return ({ value }: { value: unknown }) => {
			const result = (schema as z.ZodTypeAny).safeParse(value);
			if (!result.success) return result.error.issues[0].message;
		};
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<Fieldset>
				<Legend>Formulário - Plataforma colaborativa</Legend>
				<Text>Perguntas para plataforma colaborativa cardápio escolar.</Text>

				{/* --- DADOS DEMOGRÁFICOS --- */}
				<form.Field
					name="gender"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.gender),
					}}
				>
					{(field) => (
						<div className="mb-4 mt-2">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>Qual seu sexo? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="feminino">Feminino</Radio>
									<Radio value="masculino">Masculino</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="age_range"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.age_range),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>Qual sua idade? *</Label>
								<div className="flex flex-col gap-2 mt-2">
									<Radio value="10-11">10 a 11 anos</Radio>
									<Radio value="12-14">12 a 14 anos</Radio>
									<Radio value="15-20">15 a 20 anos</Radio>
									<Radio value="20-30">20 a 30 anos</Radio>
									<Radio value="40-50">40 a 50 anos</Radio>
									<Radio value="60-70">60 a 70 anos</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="grade"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.grade),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>Qual a série que está matriculado? *</Label>
								<div className="flex flex-col gap-2 mt-2">
									<Radio value="6_ano">6° Ano</Radio>
									<Radio value="7_ano">7° Ano</Radio>
									<Radio value="8_ano">8° Ano</Radio>
									<Radio value="9_ano">9° Ano</Radio>
									<Radio value="eja">EJA</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>
			</Fieldset>

			<Fieldset>
				<Legend>Perguntas sobre a Merenda</Legend>

				<form.Field
					name="eats_school_meal"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.eats_school_meal,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>1. Você come a merenda escolar? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="meal_frequency"
					validators={{
						onChange: ({ value }) => {
							if (value === undefined || value === null) return;

							const res = (
								surveyFormSchema.shape.meal_frequency as z.ZodTypeAny
							).safeParse(value);
							if (!res.success) return res.error.issues[0].message;
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value ?? ""}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>2. Com que frequência?</Label>
								<div className="flex flex-col gap-2 mt-2">
									<Radio value="1_vez">1 vez por semana</Radio>
									<Radio value="2_vezes">2 vezes por semana</Radio>
									<Radio value="3_vezes">3 vezes por semana</Radio>
									<Radio value="4_vezes">4 vezes por semana</Radio>
									<Radio value="todos_dias">Todos os dias</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="likes_meal"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.likes_meal),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>3. Você gosta da merenda oferecida na escola? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="menu_is_varied"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.menu_is_varied),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>4. Para você, o cardápio é variado? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="wants_to_participate"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.wants_to_participate,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>
									5. Gostaria de participar da escolha do cardápio? *
								</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="knows_pnae"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.knows_pnae),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>
									6. Conhece o Programa Nacional de Alimentos-PNAE? *
								</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="knows_paa"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.knows_paa),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>
									7. Conhece o Programa de Aquisição de Alimentos-PAA? *
								</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="knows_pas"
					validators={{
						onChange: makeFieldValidator(surveyFormSchema.shape.knows_pas),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>
									Conhece o Programa de Alimentação Saudável-PAS Nordeste? *
								</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="sim">SIM</Radio>
									<Radio value="nao">NÃO</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="favorite_regional_foods"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.favorite_regional_foods,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<CheckboxGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>
									8. Quais os alimentos regionais/nordestinos que estão no
									cardápio escolar que mais gosta? *
								</Label>
								<div className="flex flex-col gap-2 mt-2">
									<Checkbox value="cuscuz_ovo">Cuscuz com ovo</Checkbox>
									<Checkbox value="feijao_mulatinho">Feijão Mulatinho</Checkbox>
									<Checkbox value="sopa_costela">Sopa de Costela</Checkbox>
									<Checkbox value="carne_sol_nata">
										Carne de sol na nata
									</Checkbox>
									<Checkbox value="arroz_leite">Arroz de Leite</Checkbox>
									<Checkbox value="pacoca_carne">Paçoca de carne</Checkbox>
								</div>
							</CheckboxGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field name="ultraprocessed_definition">
					{(field) => (
						<TextField name={field.name} className="mb-4">
							<Label>9. O que entende por alimentos ultra processados?</Label>
							<Textarea
								className="mt-2"
								value={field.state.value ?? ""}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</TextField>
					)}
				</form.Field>

				<form.Field name="identifies_ultraprocessed">
					{(field) => (
						<TextField name={field.name} className="mb-4">
							<Label>
								10. No cardápio da merenda escolar, consegue identificar algum
								alimento ultra processados, quais?
							</Label>
							<Textarea
								className="mt-2"
								value={field.state.value ?? ""}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</TextField>
					)}
				</form.Field>

				<form.Field name="ultraprocessed_health_risks">
					{(field) => (
						<TextField name={field.name} className="mb-4">
							<Label>
								11. Quais são os principais riscos à saúde associados ao consumo
								regular de alimentos ultra processados?
							</Label>
							<Textarea
								className="mt-2"
								value={field.state.value ?? ""}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</TextField>
					)}
				</form.Field>
			</Fieldset>

			<Fieldset>
				<Legend>Sugestão de Alteração Cardápio</Legend>

				<form.Field
					name="favorite_dessert_fruit"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.favorite_dessert_fruit,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>Qual das frutas mais gosta como sobremesa? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="banana">Banana</Radio>
									<Radio value="melancia">Melancia</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="favorite_juice_fruit"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.favorite_juice_fruit,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>
									Qual fruta usada para os sucos na merenda que mais gosta? *
								</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="manga">Manga</Radio>
									<Radio value="goiaba">Goiaba</Radio>
									<Radio value="acerola">Acerola</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="favorite_vegetable"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.favorite_vegetable,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>Qual hortaliça que mais gosta? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="batata_doce">Batata doce</Radio>
									<Radio value="macaxeira">Macaxeira</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="favorite_protein"
					validators={{
						onChange: makeFieldValidator(
							surveyFormSchema.shape.favorite_protein,
						),
					}}
				>
					{(field) => (
						<div className="mb-4">
							<RadioGroup
								name={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value as any)}
							>
								<Label>Qual proteína que mais gosta? *</Label>
								<div className="flex gap-4 mt-2">
									<Radio value="carne">Carne</Radio>
									<Radio value="frango">Frango</Radio>
								</div>
							</RadioGroup>

							{field.state.meta.errors && (
								<FieldError>{field.state.meta.errors}</FieldError>
							)}
						</div>
					)}
				</form.Field>
			</Fieldset>

			<div data-slot="control" className="mt-4">
				<Button type="submit">Enviar Respostas</Button>
			</div>
		</form>
	);
}
