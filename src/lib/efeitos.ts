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
	if (!reduzido) iniciarFotons();
}

/**
 * Fótons de luz que "caem" na tela quando o usuário rola a página — remete à
 * radiação solar / geração de energia. Canvas fixo, sem interceptar cliques,
 * só roda enquanto houver partícula viva (sem loop ocioso). Desligado com
 * "reduzir movimento".
 */
function iniciarFotons() {
	const canvas = document.createElement('canvas');
	canvas.setAttribute('aria-hidden', 'true');
	Object.assign(canvas.style, {
		position: 'fixed',
		inset: '0',
		width: '100%',
		height: '100%',
		pointerEvents: 'none',
		zIndex: '60',
		mixBlendMode: 'screen',
	});
	document.body.appendChild(canvas);
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	let dpr = Math.min(window.devicePixelRatio || 1, 2);
	function redimensionar() {
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		canvas.style.width = window.innerWidth + 'px';
		canvas.style.height = window.innerHeight + 'px';
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	redimensionar();
	window.addEventListener('resize', redimensionar, { passive: true });

	type Foton = { x: number; y: number; vx: number; vy: number; vida: number; duracao: number; raio: number };
	const fotons: Foton[] = [];
	const MAX_FOTONS = 140;

	function nascer(qtd: number) {
		const largura = window.innerWidth;
		for (let i = 0; i < qtd && fotons.length < MAX_FOTONS; i++) {
			fotons.push({
				x: Math.random() * largura,
				y: -10 - Math.random() * 40,
				vx: (Math.random() - 0.5) * 18,
				vy: 60 + Math.random() * 90,
				vida: 0,
				duracao: 1400 + Math.random() * 900,
				raio: 1.3 + Math.random() * 2,
			});
		}
		ativarLoop();
	}

	let rodando = false;
	let ultimoTs = 0;
	function quadro(ts: number) {
		const dt = ultimoTs ? Math.min((ts - ultimoTs) / 1000, 0.05) : 0;
		ultimoTs = ts;
		ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
		for (let i = fotons.length - 1; i >= 0; i--) {
			const f = fotons[i];
			f.vida += dt * 1000;
			const p = f.vida / f.duracao;
			if (p >= 1) {
				fotons.splice(i, 1);
				continue;
			}
			f.x += f.vx * dt;
			f.y += f.vy * dt;
			const alpha = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
			const raio = f.raio * (1 + p * 1.8) * 4;
			const grad = ctx!.createRadialGradient(f.x, f.y, 0, f.x, f.y, raio);
			grad.addColorStop(0, `rgba(255, 245, 190, ${0.85 * alpha})`);
			grad.addColorStop(0.4, `rgba(255, 227, 90, ${0.45 * alpha})`);
			grad.addColorStop(1, 'rgba(255, 227, 90, 0)');
			ctx!.fillStyle = grad;
			ctx!.beginPath();
			ctx!.arc(f.x, f.y, raio, 0, Math.PI * 2);
			ctx!.fill();
		}
		if (fotons.length > 0) {
			requestAnimationFrame(quadro);
		} else {
			rodando = false;
			ultimoTs = 0;
		}
	}
	function ativarLoop() {
		if (rodando) return;
		rodando = true;
		requestAnimationFrame(quadro);
	}

	let ultimoScrollY = window.scrollY;
	let acumulado = 0;
	let pendente = false;
	window.addEventListener(
		'scroll',
		() => {
			const atual = window.scrollY;
			acumulado += Math.abs(atual - ultimoScrollY);
			ultimoScrollY = atual;
			if (pendente) return;
			pendente = true;
			requestAnimationFrame(() => {
				nascer(Math.min(6, Math.max(1, Math.round(acumulado / 35))));
				acumulado = 0;
				pendente = false;
			});
		},
		{ passive: true }
	);
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
