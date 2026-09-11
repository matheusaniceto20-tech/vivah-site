// Estimativa de dimensionamento fotovoltaico pra Palmas-TO e região, usada no simulador.
// São valores de referência: o dimensionamento final é feito na visita técnica.

export const REFERENCIA = {
	/** horas de sol pleno por dia (média anual aproximada em Palmas-TO) */
	hsp: 5.4,
	/** perdas de temperatura, sujeira, cabos e inversor */
	desempenho: 0.8,
	diasPorMes: 30.4,
	/** módulo usado com frequência pela Vivah */
	potenciaPlacaW: 700,
	areaPlacaM2: 3.1,
	/** R$/kWh com impostos, usado quando não dá pra calcular pela própria conta */
	tarifaPadrao: 1.1,
	/** margem pro Fio B (Lei 14.300) e outros encargos sobre a energia compensada */
	fatorCompensacao: 0.9,
	placasMinimas: 4,
} as const;

/** consumo mínimo que a distribuidora sempre cobra (custo de disponibilidade), em kWh */
export const DISPONIBILIDADE_KWH = {
	monofasico: 30,
	bifasico: 50,
	trifasico: 100,
	nao_sei: 50,
} as const;

export type Ligacao = keyof typeof DISPONIBILIDADE_KWH;

export interface Entrada {
	consumoKwh: number;
	valorConta?: number;
	ligacao: Ligacao;
}

export interface Resultado {
	consumoKwh: number;
	energiaCompensavelKwh: number;
	placas: number;
	kwp: number;
	areaM2: number;
	geracaoKwhMes: number;
	tarifa: number;
	contaAtual: number;
	contaDepois: number;
	economiaMes: number;
	economiaAno: number;
	percentual: number;
	/** consumo tão baixo que a energia solar pode não compensar */
	baixoConsumo: boolean;
}

export const geracaoPorKwpMes = REFERENCIA.hsp * REFERENCIA.diasPorMes * REFERENCIA.desempenho;

export function dimensionar({ consumoKwh, valorConta, ligacao }: Entrada): Resultado {
	const disponibilidade = DISPONIBILIDADE_KWH[ligacao];
	const energiaCompensavelKwh = Math.max(consumoKwh - disponibilidade, 0);

	const placasCalculadas = Math.ceil(((energiaCompensavelKwh / geracaoPorKwpMes) * 1000) / REFERENCIA.potenciaPlacaW);
	const placas = energiaCompensavelKwh > 0 ? Math.max(placasCalculadas, REFERENCIA.placasMinimas) : 0;
	const kwp = (placas * REFERENCIA.potenciaPlacaW) / 1000;
	const geracaoKwhMes = kwp * geracaoPorKwpMes;

	const tarifaDaConta = valorConta && consumoKwh ? valorConta / consumoKwh : NaN;
	const tarifa = tarifaDaConta >= 0.5 && tarifaDaConta <= 2.5 ? tarifaDaConta : REFERENCIA.tarifaPadrao;

	const contaAtual = valorConta && valorConta > 0 ? valorConta : consumoKwh * tarifa;
	const abatimento = Math.min(geracaoKwhMes, energiaCompensavelKwh) * tarifa * REFERENCIA.fatorCompensacao;
	const contaDepois = Math.min(contaAtual, Math.max(contaAtual - abatimento, disponibilidade * tarifa));
	const economiaMes = contaAtual - contaDepois;

	return {
		consumoKwh,
		energiaCompensavelKwh,
		placas,
		kwp,
		areaM2: placas * REFERENCIA.areaPlacaM2,
		geracaoKwhMes,
		tarifa,
		contaAtual,
		contaDepois,
		economiaMes,
		economiaAno: economiaMes * 12,
		percentual: contaAtual > 0 ? economiaMes / contaAtual : 0,
		baixoConsumo: energiaCompensavelKwh < 100,
	};
}

/** consumo estimado a partir do valor da conta, quando a pessoa não sabe o kWh */
export function consumoPeloValor(valorConta: number) {
	return valorConta / REFERENCIA.tarifaPadrao;
}
