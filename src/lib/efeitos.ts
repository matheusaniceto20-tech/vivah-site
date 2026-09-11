// Efeitos da página: revelar ao rolar, contadores animados e header que fica sólido ao rolar.
// Sem JS, ou com "reduzir movimento" ativado no sistema, tudo aparece direto, sem animação.

export function iniciarEfeitos() {
	(window as unknown as { __vivahFx?: boolean }).__vivahFx = true;
	const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const alvos = document.querySelectorAll<HTMLElement>('[data-reveal]');
	const contadores = document.querySelectorAll<HTMLElement>('[data-count-to]');

	if (reduzido || !('IntersectionObserver' in window)) {
		alvos.forEach((el) => el.classList.add('revealed'));
	} else {
		const observador = new IntersectionObserver(
			(entradas) => {
				for (const entrada of entradas) {
					if (!entrada.isIntersecting) continue;
					const el = entrada.target as HTMLElement;
					if (el.dataset.countTo) animarContador(el);
					else el.classList.add('revealed');
					observador.unobserve(el);
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
		);
		alvos.forEach((el) => observador.observe(el));
		contadores.forEach((el) => {
			el.textContent = formatarContador(el, 0);
			observador.observe(el);
		});
	}

	iniciarHeader();
}

function formatarContador(el: HTMLElement, valor: number) {
	const casas = Number(el.dataset.countDecimals ?? 0);
	const numero = valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
	return numero + (el.dataset.countSuffix ?? '');
}

function animarContador(el: HTMLElement) {
	const alvo = Number(el.dataset.countTo);
	const duracao = 1400;
	const inicio = performance.now();
	const passo = (agora: number) => {
		const progresso = Math.min((agora - inicio) / duracao, 1);
		el.textContent = formatarContador(el, alvo * (1 - Math.pow(1 - progresso, 3)));
		if (progresso < 1) requestAnimationFrame(passo);
	};
	requestAnimationFrame(passo);
}

function iniciarHeader() {
	const header = document.querySelector<HTMLElement>('[data-header]');
	if (!header || header.dataset.transparent !== 'true') return;
	const atualizar = () => header.classList.toggle('header-solido', window.scrollY > 40);
	atualizar();
	window.addEventListener('scroll', atualizar, { passive: true });
}
