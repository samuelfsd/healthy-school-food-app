"use client";

import { Form } from "react-aria-components";
import { Button } from "@/components/ui/button";
import { FieldError, Fieldset, Label, Legend } from "@/components/ui/field";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { Checkbox, CheckboxGroup } from "./ui/checkbox";
import { Radio, RadioGroup } from "./ui/radio";
import { Textarea } from "./ui/textarea";

export function PrincipalForm() {
	return (
		<Form>
			<Fieldset>
				<Legend>Formulário</Legend>
				<Text>Perguntas para plataforma colaborativa cardápio escolar.</Text>

				{/* --- DADOS DEMOGRÁFICOS --- */}
				<RadioGroup name="sexo" className="mb-4">
					<Label>Qual seu sexo?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="feminino">Feminino</Radio>
						<Radio value="masculino">Masculino</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="idade" className="mb-4">
					<Label>Qual sua idade?</Label>
					<div className="flex flex-col gap-2 mt-2">
						<Radio value="10-11">10 a 11 anos</Radio>
						<Radio value="12-14">12 a 14 anos</Radio>
						<Radio value="15-20">15 a 20 anos</Radio>
						<Radio value="20-30">20 a 30 anos</Radio>
						<Radio value="40-50">40 a 50 anos</Radio>
						<Radio value="60-70">60 a 70 anos</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="serie" className="mb-4">
					<Label>Qual a série que está matriculado?</Label>
					<div className="flex flex-col gap-2 mt-2">
						<Radio value="6_ano">6° Ano</Radio>
						<Radio value="7_ano">7° Ano</Radio>
						<Radio value="8_ano">8° Ano</Radio>
						<Radio value="9_ano">9° Ano</Radio>
						<Radio value="eja">EJA</Radio>
					</div>
				</RadioGroup>
			</Fieldset>

			<Fieldset>
				<Legend>Perguntas sobre a Merenda</Legend>

				<RadioGroup name="come_merenda" className="mb-4">
					<Label>1. Você come a merenda escolar?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="frequencia_merenda" className="mb-4">
					<Label>2. Com que frequência?</Label>
					<div className="flex flex-col gap-2 mt-2">
						<Radio value="1_vez">1 vez por semana</Radio>
						<Radio value="2_vezes">2 vezes por semana</Radio>
						<Radio value="3_vezes">3 vezes por semana</Radio>
						<Radio value="4_vezes">4 vezes por semana</Radio>
						<Radio value="todos_dias">Todos os dias</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="gosta_merenda" className="mb-4">
					<Label>3. Você gosta da merenda oferecida na escola?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="cardapio_variado" className="mb-4">
					<Label>4. Para você, o cardápio é variado?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="gostaria_participar" className="mb-4">
					<Label>5. Gostaria de participar da escolha do cardápio?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="conhece_pnae" className="mb-4">
					<Label>6. Conhece o Programa Nacional de Alimentos-PNAE?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="conhece_paa" className="mb-4">
					<Label>7. Conhece o Programa de Aquisição de Alimentos-PAA?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="conhece_pas" className="mb-4">
					<Label>
						Conhece o Programa de Alimentação Saudável-PAS Nordeste?
					</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="sim">SIM</Radio>
						<Radio value="nao">NÃO</Radio>
					</div>
				</RadioGroup>

				<CheckboxGroup name="alimentos_regionais" className="mb-4">
					<Label>
						8. Quais os alimentos regionais/nordestinos que estão no cardápio
						escolar que mais gosta?
					</Label>
					<div className="flex flex-col gap-2 mt-2">
						<Checkbox value="cuscuz_ovo">Cuscuz com ovo</Checkbox>
						<Checkbox value="feijao_mulatinho">Feijão Mulatinho</Checkbox>
						<Checkbox value="sopa_costela">Sopa de Costela</Checkbox>
						<Checkbox value="carne_sol_nata">Carne de sol na nata</Checkbox>
						<Checkbox value="arroz_leite">Arroz de Leite</Checkbox>
						<Checkbox value="pacoca_carne">Paçoca de carne</Checkbox>
					</div>
				</CheckboxGroup>

				<TextField name="definicao_ultraprocessados" className="mb-4">
					<Label>9. O que entende por alimentos ultra processados?</Label>
					<Textarea className="mt-2" />
					<FieldError />
				</TextField>

				<TextField name="identifica_ultraprocessados" className="mb-4">
					<Label>
						10. No cardápio da merenda escolar, consegue identificar algum
						alimento ultra processados, quais?
					</Label>
					<Textarea className="mt-2" />
					<FieldError />
				</TextField>

				<TextField name="riscos_ultraprocessados" className="mb-4">
					<Label>
						11. Quais são os principais riscos à saúde associados ao consumo
						regular de alimentos ultra processados?
					</Label>
					<Textarea className="mt-2" />
					<FieldError />
				</TextField>
			</Fieldset>

			<Fieldset>
				<Legend>Sugestão de Alteração Cardápio</Legend>

				<RadioGroup name="sugestao_sobremesa" className="mb-4">
					<Label>Qual das frutas mais gosta como sobremesa?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="banana">Banana</Radio>
						<Radio value="melancia">Melancia</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="sugestao_suco" className="mb-4">
					<Label>
						Qual fruta usada para os sucos na merenda que mais gosta?
					</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="manga">Manga</Radio>
						<Radio value="goiaba">Goiaba</Radio>
						<Radio value="acerola">Acerola</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="sugestao_hortalica" className="mb-4">
					<Label>Qual hortaliça que mais gosta?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="batata_doce">Batata doce</Radio>
						<Radio value="macaxeira">Macaxeira</Radio>
					</div>
				</RadioGroup>

				<RadioGroup name="sugestao_proteina" className="mb-4">
					<Label>Qual proteína que mais gosta?</Label>
					<div className="flex gap-4 mt-2">
						<Radio value="carne">Carne</Radio>
						<Radio value="frango">Frango</Radio>
					</div>
				</RadioGroup>
			</Fieldset>

			<div data-slot="control" className="mt-4">
				<Button type="submit">Enviar Respostas</Button>
			</div>
		</Form>
	);
}
