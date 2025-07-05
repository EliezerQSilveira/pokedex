let offset = 1;
const limit = 10;

async function loadPokemon(offset, limit) {
  const pokedexDiv = document.getElementById("pokedex");

  for (let i = offset; i < offset + limit; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();

    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const mainType = data.types[0].type.name;
    const bgColor = getColorByType(mainType);
    card.style.backgroundColor = bgColor;

    card.setAttribute("data-id", data.id);
    card.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p>${capitalize(data.name)}</p>
    `;

    card.addEventListener("click", () => showDetail(data.id));

    pokedexDiv.appendChild(card);
  }
}

async function showDetail(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  const detailDiv = document.getElementById("pokemon-detail");
  detailDiv.innerHTML = `
    <h2>${capitalize(data.name)}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}" />
    <p><strong>#${data.id}</strong></p>
    <p><strong>Altura:</strong> ${data.height / 10} m</p>
    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
    <p><strong>Tipos:</strong> ${data.types.map(t => capitalize(t.type.name)).join(", ")}</p>
    <button id="close-detail">Fechar</button>
  `;

  detailDiv.classList.add("show");

  document.getElementById("close-detail").onclick = () => {
    detailDiv.classList.remove("show");
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getColorByType(type) {
  const colors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
  };

  return colors[type.toLowerCase()] || "#777"; 
}

document.getElementById("search").addEventListener("input", async (e) => {
  const query = e.target.value.trim().toLowerCase();
  const pokedexDiv = document.getElementById("pokedex");

  if (query === "") {
    pokedexDiv.innerHTML = "";
    offset = 1;
    loadPokemon(offset, limit);
    return;
  }

  pokedexDiv.innerHTML = "<p>Buscando...</p>";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    
    if (!response.ok) {
      pokedexDiv.innerHTML = "<p>Pokémon não encontrado.</p>";
      return;
    }

    const data = await response.json();

    pokedexDiv.innerHTML = ""; 

    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    const mainType = data.types[0].type.name;
    const bgColor = getColorByType(mainType);
    card.style.backgroundColor = bgColor;

    card.setAttribute("data-id", data.id);
    card.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p>${capitalize(data.name)}</p>
    `;

    card.addEventListener("click", () => showDetail(data.id));

    pokedexDiv.appendChild(card);
  } catch (error) {
    console.error(error);
    pokedexDiv.innerHTML = "<p>Erro ao buscar Pokémon.</p>";
  }
});


document.getElementById("loadMore").addEventListener("click", () => {
  offset += limit;
  loadPokemon(offset, limit);
});

loadPokemon(offset, limit);
