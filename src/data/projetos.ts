// Projetos do portfólio. As fotos ficam em src/assets/projetos/<slug>/ (01.jpg é a capa).
// Nomes de clientes usados com autorização (confirmado pelo usuário em 11/09/2026).
// Especificações só quando há evidência (nome do arquivo, app de monitoramento).
import type { ImageMetadata } from 'astro';

export type Categoria = 'residencial' | 'carport' | 'grande-porte' | 'comercial';

export interface Projeto {
	slug: string;
	titulo: string;
	local?: string;
	/** um projeto pode entrar em mais de uma categoria (ex: carport de grande porte) */
	categorias: Categoria[];
	specs: string[];
	/** trecho da avaliação que a pessoa deixou no Google */
	avaliacao?: string;
	/** caminho público do vídeo do projeto (public/videos/portfolio/<slug>.mp4), opcional */
	video?: string;
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
		categorias: ['grande-porte', 'carport'],
		specs: ['Estrutura tipo carport', '56 kWp', 'Às margens do rio'],
		avaliacao:
			'Excelente empresa! Felipe desenhou o melhor projeto com soluções inovadoras para nossa empresa. Só temos a agradecer e indicar os seus serviços. O pós venda também é comprometido em oferecer todo o suporte necessário.',
	},
	{
		slug: 'pousada',
		titulo: 'Pousada Terceira Idade',
		categorias: ['grande-porte'],
		specs: ['50 placas'],
		video: '/videos/portfolio/pousada.mp4',
	},
	{
		slug: 'joaobatista',
		titulo: 'João Batista',
		categorias: ['grande-porte'],
		specs: ['50 placas'],
		video: '/videos/portfolio/joaobatista.mp4',
	},
	{
		slug: 'luciana',
		titulo: 'Luciana',
		categorias: ['grande-porte'],
		specs: ['86 placas', '60,2 kWp'],
		avaliacao: 'A melhor de Palmas. Atendimento e pós venda maravilhosa.',
	},
	{ slug: 'matheus', titulo: 'Matheus', categorias: ['grande-porte'], specs: ['60 placas'] },
	{
		slug: 'barbearia',
		titulo: 'Olimpio Barbearia',
		categorias: ['comercial'],
		specs: [],
		avaliacao: 'Excelente empresa.',
		video: '/videos/portfolio/barbearia.mp4',
	},
	{
		slug: 'eduardo',
		titulo: 'Eduardo B',
		categorias: ['residencial'],
		specs: ['28 placas', '19,6 kWp'],
	},
	{
		slug: 'edson',
		titulo: 'Edson Hugo',
		categorias: ['residencial'],
		specs: [],
		video: '/videos/portfolio/edson.mp4',
	},
	{
		slug: 'frederico',
		titulo: 'Frederico',
		categorias: ['residencial'],
		specs: [],
		video: '/videos/portfolio/frederico.mp4',
	},
	{ slug: 'marcos', titulo: 'Marcos', categorias: ['carport'], specs: ['Garagem coberta com placas'] },
	{
		slug: 'lucilene',
		titulo: 'Lucilene',
		local: '305 Sul, Palmas',
		categorias: ['residencial'],
		specs: ['16 placas', '4 microinversores'],
	},
	{
		slug: 'joaorodolfo',
		titulo: 'João Rodolfo',
		categorias: ['residencial'],
		specs: ['16 placas', '4 microinversores'],
		avaliacao:
			'Quero agradecer demais não só pela venda, negociação e preço. Mas pela qualidade da entrega, dos produtos, do trabalho e principalmente pelo pós venda!',
	},
	{
		slug: 'paulo',
		titulo: 'Paulo',
		categorias: ['residencial'],
		specs: ['14 placas', '4 microinversores', 'Padrão de energia refeito'],
	},
	{
		slug: 'jahiny',
		titulo: 'Jahiny',
		categorias: ['residencial'],
		specs: ['11 placas', '3 microinversores'],
		avaliacao: 'Pré e pós venda de excelência! Empresa realmente comprometida com o cliente e o trabalho desempenhado!',
	},
	{
		slug: 'stela',
		titulo: 'Stela',
		categorias: ['residencial'],
		specs: ['7,0 kWp'],
		avaliacao:
			'Eu sempre tive vontade de colocar energia solar na minha casa [...] a Vivah pôde me oferecer isso, me auxiliar e deu certo. Não me arrependo, e recomendo.',
	},
	{
		slug: 'joana',
		titulo: 'Joana',
		categorias: ['residencial'],
		specs: [],
		avaliacao:
			'Vim avaliar após um ano de instalação da minha energia solar, nunca tive nenhum problema e sempre tive um excelente atendimento no pós-venda.',
	},
	{
		slug: 'fabio',
		titulo: 'Fábio',
		categorias: ['residencial'],
		specs: ['12 placas', '3 microinversores'],
		avaliacao: 'Produto excelente! Manutenção, acompanhamento, qualidade das placas e nos inversores. 100% confiável.',
	},
	{ slug: 'gerson', titulo: 'Gerson', categorias: ['residencial'], specs: ['10 placas', '3 microinversores'] },
];

export const projetos: Projeto[] = dados.map((p) => ({ ...p, fotos: fotosDe(p.slug) })).filter((p) => p.fotos.length > 0);

export const rotuloCategoria: Record<Categoria, string> = {
	residencial: 'Residencial',
	carport: 'Carport',
	'grande-porte': 'Grande porte',
	comercial: 'Comercial',
};

export const categorias = [
	{ id: 'todos', rotulo: 'Todos' },
	{ id: 'residencial', rotulo: 'Residencial' },
	{ id: 'carport', rotulo: 'Carport e garagens' },
	{ id: 'grande-porte', rotulo: 'Grande porte' },
	{ id: 'comercial', rotulo: 'Comercial' },
].map((c) => ({
	...c,
	total: c.id === 'todos' ? projetos.length : projetos.filter((p) => p.categorias.includes(c.id as Categoria)).length,
}));
