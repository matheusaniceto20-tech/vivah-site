// Projetos do portfólio. As fotos ficam em src/assets/projetos/<slug>/ (01.jpg é a capa).
// Nomes de clientes usados com autorização (confirmado pelo usuário em 11/09/2026).
// Especificações só quando há evidência (nome do arquivo, app de monitoramento).
import type { ImageMetadata } from 'astro';

export type Categoria = 'residencial' | 'carport' | 'grande-porte';

export interface Projeto {
	slug: string;
	titulo: string;
	local?: string;
	categoria: Categoria;
	specs: string[];
	/** trecho da avaliação que a pessoa deixou no Google */
	avaliacao?: string;
	fotos: ImageMetadata[];
}

const arquivos = import.meta.glob<{ default: ImageMetadata }>('../assets/projetos/*/*.jpg', { eager: true });

function fotosDe(slug: string) {
	return Object.entries(arquivos)
		.filter(([caminho]) => caminho.includes(`/projetos/${slug}/`))
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, modulo]) => modulo.default);
}

const dados: Omit<Projeto, 'fotos'>[] = [
	{
		slug: 'naval',
		titulo: 'Naval',
		local: 'Caseara (TO)',
		categoria: 'carport',
		specs: ['Estrutura tipo carport', 'Às margens do rio'],
	},
	{ slug: 'matheus', titulo: 'Matheus', categoria: 'grande-porte', specs: ['60 placas'] },
	{
		slug: 'luciana',
		titulo: 'Luciana',
		categoria: 'grande-porte',
		specs: ['Telhados de grande área'],
		avaliacao: 'A melhor de Palmas. Atendimento e pós venda maravilhosa.',
	},
	{ slug: 'marcos', titulo: 'Marcos', categoria: 'carport', specs: ['Garagem coberta com placas'] },
	{
		slug: 'lucilene',
		titulo: 'Lucilene',
		local: '305 Sul, Palmas',
		categoria: 'residencial',
		specs: ['16 placas', '4 microinversores'],
	},
	{
		slug: 'paulo',
		titulo: 'Paulo',
		categoria: 'residencial',
		specs: ['14 placas', '4 microinversores', 'Padrão de energia refeito'],
	},
	{
		slug: 'jahiny',
		titulo: 'Jahiny',
		categoria: 'residencial',
		specs: ['11 placas', '3 microinversores'],
		avaliacao: 'Pré e pós venda de excelência! Empresa realmente comprometida com o cliente e o trabalho desempenhado!',
	},
	{
		slug: 'stela',
		titulo: 'Stela',
		categoria: 'residencial',
		specs: ['7,0 kWp'],
		avaliacao:
			'Eu sempre tive vontade de colocar energia solar na minha casa [...] a Vivah pôde me oferecer isso, me auxiliar e deu certo. Não me arrependo, e recomendo.',
	},
	{
		slug: 'joana',
		titulo: 'Joana',
		categoria: 'residencial',
		specs: [],
		avaliacao:
			'Vim avaliar após um ano de instalação da minha energia solar, nunca tive nenhum problema e sempre tive um excelente atendimento no pós-venda.',
	},
	{
		slug: 'fabio',
		titulo: 'Fábio',
		categoria: 'residencial',
		specs: ['12 placas', '3 microinversores'],
		avaliacao: 'Produto excelente! Manutenção, acompanhamento, qualidade das placas e nos inversores. 100% confiável.',
	},
	{ slug: 'gerson', titulo: 'Gerson', categoria: 'residencial', specs: ['10 placas', '3 microinversores'] },
];

export const projetos: Projeto[] = dados.map((p) => ({ ...p, fotos: fotosDe(p.slug) })).filter((p) => p.fotos.length > 0);

export const rotuloCategoria: Record<Categoria, string> = {
	residencial: 'Residencial',
	carport: 'Carport',
	'grande-porte': 'Grande porte',
};

export const categorias = [
	{ id: 'todos', rotulo: 'Todos' },
	{ id: 'residencial', rotulo: 'Residencial' },
	{ id: 'carport', rotulo: 'Carport e garagens' },
	{ id: 'grande-porte', rotulo: 'Grande porte' },
].map((c) => ({
	...c,
	total: c.id === 'todos' ? projetos.length : projetos.filter((p) => p.categoria === c.id).length,
}));
