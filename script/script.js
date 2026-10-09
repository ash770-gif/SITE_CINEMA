const chaveMinhaLista = "imds-minha-lista";

function lerMinhaLista() {
	try {
		return JSON.parse(localStorage.getItem(chaveMinhaLista)) || [];
	} catch {
		return [];
	}
}

function salvarMinhaLista(lista) {
	localStorage.setItem(chaveMinhaLista, JSON.stringify(lista));
}

function alternarLista(botao) {
	const cartao = botao.closest(".cartao-filme");
	const titulo = cartao.dataset.titulo;
	const lista = lerMinhaLista();
	const indice = lista.indexOf(titulo);

	if (indice === -1) {
		lista.push(titulo);
	} else {
		lista.splice(indice, 1);
	}

	salvarMinhaLista(lista);
	atualizarBotaoLista(botao, lista.includes(titulo));
}

function atualizarBotaoLista(botao, estaNaLista) {
	botao.textContent = estaNaLista ? "✓ Na Minha Lista" : "+ Minha Lista";
	botao.setAttribute("aria-pressed", String(estaNaLista));
}

function abrirModal(cartao) {
	const modal = document.getElementById("modalDetalhes");

	document.getElementById("modalTitulo").textContent = cartao.dataset.titulo;
	document.getElementById("modalNota").textContent = cartao.dataset.nota;
	document.getElementById("modalSinopse").textContent = cartao.dataset.sinopse;
	document.getElementById("modalImportancia").textContent = cartao.dataset.importancia;
	document.getElementById("modalAno").textContent = cartao.dataset.ano;
	document.getElementById("modalGenero").textContent = cartao.dataset.genero;

	if (!modal.open) {
		modal.showModal();
	}
}

function fecharModal() {
	const modal = document.getElementById("modalDetalhes");
	if (modal.open) {
		modal.close();
	}
}

function normalizarTexto(texto) {
	return texto
		.toLocaleLowerCase("pt-BR")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

document.addEventListener("DOMContentLoaded", () => {
	const cartoes = [...document.querySelectorAll(".cartao-filme")];
	const campoBusca = document.getElementById("campoBusca");
	const botoesFiltro = [...document.querySelectorAll("#grupoFiltros [data-tema]")];
	const modal = document.getElementById("modalDetalhes");
	let temaSelecionado = "todos";

	function filtrarFilmes() {
		const busca = normalizarTexto(campoBusca.value.trim());

		cartoes.forEach((cartao) => {
			const correspondeTema = temaSelecionado === "todos" || cartao.dataset.tema === temaSelecionado;
			const conteudo = normalizarTexto([
				cartao.dataset.titulo,
				cartao.dataset.ano,
				cartao.dataset.genero,
				cartao.querySelector(".categoria-tag").textContent,
			].join(" "));

			cartao.hidden = !correspondeTema || !conteudo.includes(busca);
		});
	}

	campoBusca.addEventListener("input", filtrarFilmes);

	botoesFiltro.forEach((botao) => {
		botao.setAttribute("aria-pressed", String(botao.dataset.tema === temaSelecionado));
		botao.addEventListener("click", () => {
			temaSelecionado = botao.dataset.tema;

			botoesFiltro.forEach((item) => {
				const ativo = item === botao;
				item.classList.toggle("btn_ativo", ativo);
				item.classList.toggle("btn_genero", !ativo);
				item.setAttribute("aria-pressed", String(ativo));
			});

			filtrarFilmes();
		});
	});

	cartoes.forEach((cartao) => {
		const botaoLista = cartao.querySelector(".botao-lista");
		atualizarBotaoLista(botaoLista, lerMinhaLista().includes(cartao.dataset.titulo));
	});

	modal.addEventListener("click", (evento) => {
		if (evento.target === modal) {
			fecharModal();
		}
	});
});
