import { describe, expect, it } from "vitest";
import {
  getPokemons,
  getPokemonsByTypePaginated,
} from "../../actions/pokemon.action";

describe("getPokemon Server Action", () => {
  it("should fetch and correctly transform the pokemon data on success", async () => {
    const pokemon = await getPokemons();
    expect(pokemon).toHaveLength(2);
    expect(pokemon[0]).toEqual({
      id: 1,
      name: "Bulbasaur",
      image: "https://example.com/bulbasaur.png",
      types: ["grass", "poison"],
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        spAtk: 65,
        spDef: 65,
        speed: 45,
      },
    });
  });

  it("should fetch and correctly transform the pokemon data by type", async () => {
    const pokemon = await getPokemonsByTypePaginated("grass");
    expect(pokemon).toHaveLength(2);
    expect(pokemon[0]).toEqual({
      id: undefined,
      name: "Bulbasaur",
      image: "https://example.com/bulbasaur.png",
      types: ["grass", "poison"],
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        spAtk: 65,
        spDef: 65,
        speed: 45,
      },
    });
    expect(pokemon[1]).toEqual({
      id: undefined,
      image: "https://example.com/charmander.png",
      name: "Ivysaur",
      stats: {
        attack: 52,
        defense: 43,
        hp: 39,
        spAtk: 60,
        spDef: 50,
        speed: 65,
      },
      types: ["fire"],
    });
  });
});
