// Dados centrais do negócio — ver /_memoria/empresa.md no projeto MazyOS.
// Mudou algo (telefone, endereço, etc.)? Atualiza aqui, é a única fonte usada pelo site.

export const negocio = {
	nome: 'Vivah Soluções Fotovoltaicas',
	razaoSocial: 'Vivah Soluções em Energia Fotovoltaica Ltda',
	marca: 'Vivah Energia Solar',
	cnpj: '55.417.228/0001-73',
	fundacao: '2024-06-06',
	telefone: '(63) 99964-6802',
	whatsappNumero: '5563999646802',
	whatsappMensagemPadrao: 'Olá! Vim pelo site e quero saber mais sobre energia solar.',
	instagram: '@vivahsolar',
	instagramUrl: 'https://instagram.com/vivahsolar',
	cidade: 'Palmas - TO',
	raioAtendimento: 'até 300km de Palmas',
	notaGoogle: 5.0,
	avaliacoesGoogle: 14,
	googlePerfilUrl: 'https://www.google.com/maps?cid=9400688741611047832',
	localizacao: { lat: -10.2483985, lng: -48.3398451 },
} as const;

export function linkWhatsApp(mensagem: string = negocio.whatsappMensagemPadrao) {
	return `https://wa.me/${negocio.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

export const linkComoChegar = `https://www.google.com/maps/dir/?api=1&destination=${negocio.localizacao.lat},${negocio.localizacao.lng}`;

export const mapaEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(negocio.nome)}&ll=${negocio.localizacao.lat},${negocio.localizacao.lng}&z=16&output=embed`;

export function anosDeMercado(hoje = new Date()) {
	const anos = (hoje.getTime() - new Date(negocio.fundacao).getTime()) / (365.25 * 24 * 3600 * 1000);
	return Math.max(1, Math.floor(anos));
}
