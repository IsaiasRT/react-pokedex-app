import { useState } from "react";
import Pokedex from "./Pokedex";
import './App.css';
function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  return (
    <div className="app-container">
      <h1>Pokédex</h1>
      <Pokedex onSelectPokemon={setSelectedPokemon} />
      {selectedPokemon && <p> {selectedPokemon}</p>}
    </div>
  );
}

export default App;

