const URL_API = "https://restcountries.com/v3.1/all";
const containerPaises = document.getElementById("container-paises");
const inputPesquisa = document.getElementById("pesquisa");
const botaoPesquisa = document.getElementById("botao-pesquisa");
const containerPaginacao = document.getElementById("paginacao");

let paises = [];
let paginaAtual = 1;
const paisesPorPagina = 24;

function reloadPage(event) {
  event.preventDefault(); 
  location.reload(); 
}

document.getElementById("homeLink").addEventListener("click", reloadPage);

async function buscarPaises() {
  try {
    const resposta = await fetch(URL_API);
    paises = await resposta.json();
    exibirPaises();
  } catch (erro) {
    console.error("Erro ao buscar países:", erro);
  }
}

function exibirPaises() {
  const inicio = (paginaAtual - 1) * paisesPorPagina;
  const fim = inicio + paisesPorPagina;
  const paisesExibidos = paises.slice(inicio, fim);

  containerPaises.innerHTML = paisesExibidos
    .map((pais) => criarCartaoPais(pais))
    .join("");
  atualizarPaginacao();
}

function criarCartaoPais(pais) {
  const bandeira = pais.flags.png || pais.flags.svg || "";
  const nome = pais.name.common || "N/A";
  const capital = pais.capital ? pais.capital[0] : "N/A";
  const regiao = pais.region || "N/A";
  const codigo = pais.cca3 || "N/A";

  return `
        <div class="cartao-pais">
            <img src="${bandeira}" alt="Bandeira de ${nome}">
            <h2>${nome}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Região:</strong> ${regiao}</p>
            <p><strong>Código:</strong> ${codigo}</p>
        </div>
    `;
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(paises.length / paisesPorPagina);
  containerPaginacao.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const botao = document.createElement("button");
    botao.textContent = i;
    botao.disabled = i === paginaAtual;
    botao.onclick = () => {
      paginaAtual = i;
      exibirPaises();
    };
    containerPaginacao.appendChild(botao);
  }
}

botaoPesquisa.addEventListener("click", async () => {
  const consulta = inputPesquisa.value.trim();
  if (!consulta) {
    buscarPaises();
    return;
  }
  try {
    const resposta = await fetch(
      `https://restcountries.com/v3.1/name/${consulta}`
    );
    paises = await resposta.json();
    paginaAtual = 1;
    exibirPaises();
  } catch (erro) {
    console.error("Erro ao pesquisar países:", erro);
  }
});

inputPesquisa.addEventListener("keypress", (e) => {
  if (e.key === "Enter") botaoPesquisa.click();
});

buscarPaises();
