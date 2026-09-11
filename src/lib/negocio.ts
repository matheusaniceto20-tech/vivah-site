// Dados centrais do negócio — ver /_memoria/empresa.md no projeto MazyOS.
// Mudou algo (telefone, endereço, etc.)? Atualiza aqui, é a única fonte usada pelo site.

export const negocio = {
	nome: 'Vivah Soluções Fotovoltaicas',
	marca: 'Vivah Energia Solar',
	telefone: '(63) 99964-6802',
	whatsappNumero: '5563999646802',
	whatsappMensagemPadrao: 'Olá! Vim pelo site e quero saber mais sobre energia solar.',
	instagram: '@vivahsolar',
	instagramUrl: 'https://instagram.com/vivahsolar',
	cidade: 'Palmas - TO',
	raioAtendimento: 'até 300km de Palmas',
	notaGoogle: 5.0,
	avaliacoesGoogle: 14,
} as const;

export function linkWhatsApp(mensagem: string = negocio.whatsappMensagemPadrao) {
	return `https://wa.me/${negocio.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}
