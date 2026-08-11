import { useEffect, useRef, useState } from "react"

import "./Landing.css"

const NAV = [
	{ id: "panoramica", label: "Panoramica" },
	{ id: "funzionalita", label: "Funzionalità" },
	{ id: "architettura", label: "Architettura" },
	{ id: "deploy", label: "Deploy" },
]

const PANELS = [
	{ name: "header", version: "2.4.0", team: "Design System", lines: [72, 40] },
	{ name: "catalog", version: "1.9.2", team: "Discovery", lines: [90, 64, 48] },
	{ name: "cart", version: "3.0.1", team: "Growth", lines: [58, 82] },
]

const VARIANTS = [
	{
		id: "stable",
		label: "checkout",
		version: "1.8.0",
		tag: "stabile · 90%",
		steps: ["Indirizzo", "Pagamento", "Riepilogo"],
		note: "Tre passaggi, il flusso servito alla maggior parte del traffico.",
	},
	{
		id: "canary",
		label: "checkout-new",
		version: "0.3.1",
		tag: "canary · 10%",
		steps: ["Paga in un tap"],
		note: "Un solo passaggio, in rollout su una fascia di utenti. Nessun rebuild dell'host.",
	},
]

const FEATURES = [
	{
		size: "wide",
		kicker: "Composizione",
		title: "Module Federation, senza attriti.",
		body: "Vite o Webpack, remote esposti come moduli standard. L'orchestratore risolve a runtime quale versione caricare, host e remote restano disaccoppiati.",
	},
	{
		kicker: "Versioning",
		title: "Atomico.",
		body: "Ogni pubblicazione è una versione immutabile. Il rollback è la selezione di quella precedente.",
	},
	{
		kicker: "Rollout",
		title: "Progressivo.",
		body: "Canary per percentuale o per fascia di utenti, con promozione graduale a produzione.",
	},
	{
		kicker: "Ambienti",
		title: "Uno per ogni stadio.",
		body: "Dev, staging e produzione condividono la stessa pipeline e differiscono solo nella versione risolta.",
	},
	{
		size: "wide",
		kicker: "Autonomia",
		title: "Ogni team pubblica quando è pronto.",
		body: "Nessuna finestra di rilascio condivisa, nessun rebuild dell'host: si aggiorna un remote e la composizione lo recepisce al caricamento successivo.",
	},
]

const STEPS = [
	{
		n: "01",
		title: "Pubblica",
		body: "La CI costruisce il remote e carica l'artefatto sull'orchestratore, marcato con la sua versione.",
	},
	{
		n: "02",
		title: "Orchestra",
		body: "Dalla console decidi quale versione serve ogni ambiente, e a quale quota di traffico.",
	},
	{
		n: "03",
		title: "Servi",
		body: "L'host interroga l'orchestratore all'avvio, riceve la mappa dei remote e monta l'interfaccia.",
	},
]

function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
	const ref = useRef(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (typeof IntersectionObserver === "undefined") {
			setVisible(true)
			return
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisible(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<Tag
			ref={ref}
			className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
			style={{ "--reveal-delay": `${delay}ms` }}
			{...rest}>
			{children}
		</Tag>
	)
}

function Nav() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<header className={`nav${scrolled ? " is-scrolled" : ""}`}>
			<nav className="nav__inner" aria-label="Navigazione principale">
				<a className="nav__brand" href="#panoramica">
					<span className="nav__mark" aria-hidden="true" />
					Orchestrator
				</a>
				<ul className="nav__links">
					{NAV.map((item) => (
						<li key={item.id}>
							<a href={`#${item.id}`}>{item.label}</a>
						</li>
					))}
				</ul>
				<a className="nav__cta" href="#deploy">
					Inizia
				</a>
			</nav>
		</header>
	)
}

function ShellMockup() {
	const [active, setActive] = useState(VARIANTS[1].id)
	const variant = VARIANTS.find((v) => v.id === active) ?? VARIANTS[0]

	return (
		<div className="shell">
			<div className="shell__bar">
				<span className="shell__dot" />
				<span className="shell__dot" />
				<span className="shell__dot" />
				<span className="shell__url">host-shell · produzione</span>
			</div>

			<div className="shell__body">
				{PANELS.map((panel) => (
					<article className="panel" key={panel.name}>
						<header className="panel__head">
							<span className="panel__name">{panel.name}</span>
							<span className="panel__version">{panel.version}</span>
						</header>
						<div className="panel__lines">
							{panel.lines.map((width, i) => (
								<span key={i} style={{ width: `${width}%` }} />
							))}
						</div>
						<footer className="panel__team">{panel.team}</footer>
					</article>
				))}

				<article className="panel panel--focus">
					<header className="panel__head">
						<span className="panel__name">{variant.label}</span>
						<span className="panel__version panel__version--live">{variant.version}</span>
					</header>

					<div className="panel__steps" key={variant.id}>
						{variant.steps.map((step, i) => (
							<span className="panel__step" key={step} style={{ "--reveal-delay": `${i * 70}ms` }}>
								{step}
							</span>
						))}
					</div>

					<p className="panel__note">{variant.note}</p>

					<div className="segmented" role="group" aria-label="Versione servita">
						{VARIANTS.map((v) => (
							<button
								type="button"
								key={v.id}
								className={`segmented__item${v.id === active ? " is-active" : ""}`}
								aria-pressed={v.id === active}
								onClick={() => setActive(v.id)}>
								{v.tag}
							</button>
						))}
					</div>
				</article>
			</div>
		</div>
	)
}

function Diagram() {
	const remotes = [
		{ label: "header", x: 15 },
		{ label: "catalog", x: 255 },
		{ label: "checkout-new", x: 495 },
		{ label: "cart", x: 735 },
	]

	return (
		<svg className="diagram" viewBox="0 0 960 420" role="img" aria-label="L'host interroga l'orchestratore, che risolve la versione di ogni microfrontend">
			{[110, 350, 590, 830].map((cx) => (
				<path
					key={cx}
					className="diagram__flow"
					d={`M ${cx} 340 C ${cx} 290, 480 300, 480 250`}
					fill="none"
				/>
			))}
			<path className="diagram__flow" d="M 480 170 L 480 84" fill="none" />

			<g className="diagram__node diagram__node--host">
				<rect x="330" y="20" width="300" height="64" rx="18" />
				<text x="480" y="47" className="diagram__title">Host shell</text>
				<text x="480" y="67" className="diagram__sub">un solo deploy, mai riscritto</text>
			</g>

			<g className="diagram__node diagram__node--hub">
				<rect x="300" y="170" width="360" height="80" rx="22" />
				<text x="480" y="205" className="diagram__title">MFE Orchestrator</text>
				<text x="480" y="227" className="diagram__sub">registry · versioni · ambienti</text>
			</g>

			{remotes.map((remote) => (
				<g className="diagram__node" key={remote.label}>
					<rect x={remote.x} y="340" width="190" height="62" rx="18" />
					<text x={remote.x + 95} y="370" className="diagram__title">{remote.label}</text>
					<text x={remote.x + 95} y="389" className="diagram__sub">remoteEntry.js</text>
				</g>
			))}
		</svg>
	)
}

export const Landing = () => {
	return (
		<div className="landing">
			<Nav />

			<main>
				<section className="hero" id="panoramica">
					<div className="hero__glow" aria-hidden="true" />
					<Reveal as="p" className="hero__kicker">
						MFE Orchestrator
					</Reveal>
					<Reveal as="h1" className="hero__title" delay={80}>
						Un host.
						<br />
						<span className="hero__gradient">Tutti i tuoi microfrontend.</span>
					</Reveal>
					<Reveal as="p" className="hero__lede" delay={160}>
						Pubblica ogni parte dell'interfaccia quando è pronta. L'orchestratore decide quale
						versione va in scena, e la cambia senza ricostruire nulla.
					</Reveal>
					<Reveal className="hero__actions" delay={240}>
						<a className="btn btn--primary" href="#deploy">
							Inizia
						</a>
						<a className="btn btn--ghost" href="#architettura">
							Guarda come funziona <span aria-hidden="true">›</span>
						</a>
					</Reveal>
					<Reveal className="hero__stage" delay={320}>
						<ShellMockup />
					</Reveal>
					<Reveal as="p" className="hero__caption" delay={400}>
						Quattro team, quattro cicli di rilascio, una sola interfaccia.
					</Reveal>
				</section>

				<section className="section section--alt" id="funzionalita">
					<div className="section__inner">
						<Reveal as="h2" className="section__title">
							Progettato per chi
							<br />
							rilascia spesso.
						</Reveal>
						<div className="bento">
							{FEATURES.map((feature, i) => (
								<Reveal
									as="article"
									key={feature.title}
									delay={i * 70}
									className={`card${feature.size === "wide" ? " card--wide" : ""}`}>
									<p className="card__kicker">{feature.kicker}</p>
									<h3 className="card__title">{feature.title}</h3>
									<p className="card__body">{feature.body}</p>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				<section className="section" id="architettura">
					<div className="section__inner">
						<Reveal as="p" className="section__kicker">
							Architettura
						</Reveal>
						<Reveal as="h2" className="section__title" delay={60}>
							Risolto a runtime.
						</Reveal>
						<Reveal as="p" className="section__lede" delay={120}>
							L'host non conosce gli indirizzi dei remote: li chiede. Cambiare versione è cambiare
							una riga nel registry, non un deploy.
						</Reveal>
						<Reveal className="diagram__frame" delay={180}>
							<Diagram />
						</Reveal>

						<div className="steps">
							{STEPS.map((step, i) => (
								<Reveal as="article" className="step" key={step.n} delay={i * 90}>
									<span className="step__n">{step.n}</span>
									<h3 className="step__title">{step.title}</h3>
									<p className="step__body">{step.body}</p>
								</Reveal>
							))}
						</div>
					</div>
				</section>

				<section className="section section--alt" id="deploy">
					<div className="section__inner">
						<Reveal as="p" className="section__kicker">
							Deploy
						</Reveal>
						<Reveal as="h2" className="section__title" delay={60}>
							Un tag. Ed è online.
						</Reveal>
						<Reveal as="p" className="section__lede" delay={120}>
							La pipeline costruisce, firma la versione e la consegna all'orchestratore. Da lì la
							promozione è una scelta, non un rilascio.
						</Reveal>

						<Reveal className="terminal" delay={180}>
							<div className="terminal__bar">
								<span className="shell__dot" />
								<span className="shell__dot" />
								<span className="shell__dot" />
								<span className="shell__url">🚀 Build and deploy</span>
							</div>
							<pre className="terminal__body">
								<code>
									<span className="terminal__cmd">$ git tag 0.3.1 &amp;&amp; git push --tags</span>
									{"\n"}
									<span className="terminal__ok">✓</span> build      dist/ pronto in 4.1s{"\n"}
									<span className="terminal__ok">✓</span> publish    checkout-new@0.3.1{"\n"}
									<span className="terminal__ok">✓</span> live       canary 10% · produzione
								</code>
							</pre>
						</Reveal>

						<Reveal className="closing" delay={240}>
							<h2 className="closing__title">Componi l'interfaccia. Non il calendario.</h2>
							<div className="hero__actions">
								<a className="btn btn--primary" href="https://console.mfe-orchestrator.dev">
									Apri la console
								</a>
								<a className="btn btn--ghost" href="#panoramica">
									Torna su <span aria-hidden="true">›</span>
								</a>
							</div>
						</Reveal>
					</div>
				</section>
			</main>

			<footer className="footer">
				<p>MFE Orchestrator · sandbox · microfrontend checkout-new</p>
			</footer>
		</div>
	)
}

export default Landing
