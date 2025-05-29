import { useState, useEffect } from "react";

const PokemonDetail = ({ pokemon, onClose }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemonData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [pokemon]);

  if (loading) return (
    <div className="pokemon-detail">
      <div className="detail-screen">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="pokemon-detail">
      <div className="detail-screen">Error loading Pokémon details!</div>
    </div>
  );

  const spriteUrl = isShiny 
    ? pokemonData.sprites.front_shiny 
    : pokemonData.sprites.front_default;

  return (
    <div className="pokemon-detail">
      <div className="detail-screen">
        <div className="detail-header">
          <h2>{pokemonData.name.toUpperCase()}</h2>
          <p>#{pokemonData.id.toString().padStart(3, '0')}</p>
        </div>
        
        <div className="detail-image">
          <img src={spriteUrl} alt={pokemonData.name} className="pokemon-sprite" />
        </div>
        
        <div className="detail-info">
          <div className="types">
            <h3>Type:</h3>
            <div className="type-badges">
              {pokemonData.types.map((type) => (
                <span key={type.type.name} className={`type ${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="stats">
            <h3>Stats:</h3>
            <div className="stat-bars">
              {pokemonData.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-bar">
                  <span className="stat-name">{stat.stat.name}</span>
                  <div className="stat-value-container">
                    <div 
                      className="stat-value" 
                      style={{ width: `${Math.min(100, stat.base_stat / 2)}%` }}
                    ></div>
                  </div>
                  <span className="stat-number">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button className="shiny-toggle" onClick={() => setIsShiny(!isShiny)}>
          {isShiny ? "Normal Form" : "Shiny Form"}
        </button>
        
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const PokemonList = ({ onSelectPokemon }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        setPokemons(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const filteredPokemons = pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="list-screen">
      <div className="loading-indicator">
        <div className="pokeball-loading"></div>
        <p>Loading Pokémon...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="list-screen">
      <div className="error-message">
        <p>Something went wrong!</p>
        <p>Unable to connect to PokéAPI.</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="list-screen">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="pokemon-list">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, index) => {
            // Extract the ID from the URL
            const id = pokemon.url.split('/').filter(Boolean).pop();
            
            return (
              <div
                key={pokemon.name}
                className="pokemon-list-item"
                onClick={() => onSelectPokemon(pokemon.name)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectPokemon(pokemon.name);
                }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={pokemon.name}
                />
                <p>{pokemon.name}</p>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No Pokémon found.</p>
            <p>Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Pokedex = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoritePokemon")) || []
  );

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favoritePokemon", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pokemonName) => {
    if (favorites.includes(pokemonName)) {
      setFavorites(favorites.filter(name => name !== pokemonName));
    } else {
      setFavorites([...favorites, pokemonName]);
    }
  };

  return (
    <div className="pokedex-container">
      <div className="pokedex-left">
        <div className="top-lights">
          <div className="big-light"></div>
          <div className="small-light red"></div>
          <div className="small-light yellow"></div>
          <div className="small-light green"></div>
        </div>
        
        <div className="main-screen-container">
          <PokemonList onSelectPokemon={setSelectedPokemon} />
        </div>
        
        <div className="bottom-controls">
          <div className="d-pad">
            <div className="d-pad-horizontal"></div>
            <div className="d-pad-vertical"></div>
          </div>
          <div className="buttons">
            <div className="button red-button"></div>
            <div className="button blue-button"></div>
          </div>
          <div className="green-screen"></div>
        </div>
      </div>
      
      <div className="pokedex-hinge"></div>
      
      <div className="pokedex-right">
        {selectedPokemon ? (
          <PokemonDetail 
            pokemon={selectedPokemon} 
            onClose={() => setSelectedPokemon(null)}
            isFavorite={favorites.includes(selectedPokemon)}
            onToggleFavorite={() => toggleFavorite(selectedPokemon)}
          />
        ) : (
          <div className="right-screen">
            <div className="right-screen-display">
              <h2>Select a Pokémon</h2>
              <p>Click on a Pokémon in the list to see details</p>
            </div>
          </div>
        )}
        
        <div className="blue-buttons-grid">
          {Array(10).fill().map((_, i) => (
            <div key={i} className="blue-button-cell"></div>
          ))}
        </div>
        
        <div className="white-buttons">
          <div className="white-button"></div>
          <div className="white-button"></div>
        </div>
        
        <div className="bottom-screens">
          <div className="black-screen"></div>
          <div className="black-screen"></div>
        </div>
        
        <div className="yellow-button"></div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>
      <Pokedex />
      <footer className="footer">
        <p>Powered by <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a></p>
        <p>NYC Pokédex Project 🍕🗽</p>
      </footer>
    </div>
  );
}



