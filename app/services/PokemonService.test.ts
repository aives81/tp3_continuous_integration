import { describe, it, expect, beforeEach, vi } from "vitest";
import { PokemonService } from "./PokemonService";
import { Pokemon } from "./pokemon";
import { PokeApiClient } from "./PokeApiClient";

vi.mock("./PokeApiClient");

describe("PokemonService", () => {
  let pokemonService: PokemonService;
  let mockPokeApiClient: PokeApiClient;

  const mockPokemonList: Pokemon[] = [
    {
      id: 1,
      name: "Bulbasaur",
      types: ["grass", "poison"],
      sprite: "bulbasaur.png",
    },
    { id: 2, name: "Charmander", types: ["fire"], sprite: "charmander.png" },
    { id: 3, name: "Squirtle", types: ["water"], sprite: "squirtle.png" },
    { id: 4, name: "Pikachu", types: ["electric"], sprite: "pikachu.png" },
    { id: 5, name: "Jigglypuff", types: ["fairy"], sprite: "jigglypuff.png" },
    { id: 6, name: "Meowth", types: ["normal"], sprite: "meowth.png" },
    { id: 7, name: "Psyduck", types: ["water"], sprite: "psyduck.png" },
  ];

  beforeEach(() => {
    mockPokeApiClient = new PokeApiClient();
    mockPokeApiClient.getPokemonList = vi
      .fn()
      .mockResolvedValue(mockPokemonList);
    pokemonService = new PokemonService(mockPokeApiClient);
  });

  describe("getPokemonList", () => {
    it("should return pokemon list from API client", async () => {
      const expectedPokemonList = mockPokemonList;
      expect(await pokemonService.getPokemonList()).toEqual(
        expectedPokemonList,
      );
    });
  });

  describe("getUserTeam", () => {
    it("should return user team", () => {
      pokemonService.togglePokemonInTeam("1", mockPokemonList[0]);
      const result = pokemonService.getUserTeam("1");
      expect(result).toEqual([mockPokemonList[0]]);
    });

    it("should return empty array if user has no team", () => {
      const result = pokemonService.getUserTeam("1");
      expect(result).toEqual([]);
    });
  });

  describe("clearTeam", () => {
    it("should clear user team", () => {
      pokemonService.togglePokemonInTeam("1", mockPokemonList[0]);
      pokemonService.clearTeam("1");
      const result = pokemonService.getUserTeam("1");
      expect(result).toEqual([]);
    });

    it("should do nothing if user has no team", () => {
      pokemonService.clearTeam("1");
      const result = pokemonService.getUserTeam("1");
      expect(result).toEqual([]);
    });
  });

  describe("togglePokemonInTeam", () => {
    it("should add pokemon to user team", () => {
      const result = pokemonService.togglePokemonInTeam(
        "1",
        mockPokemonList[0],
      );
      expect(result).toBe(true);
      expect(pokemonService.getUserTeam("1")).toEqual([mockPokemonList[0]]);
    });

    it("should remove specified pokemon if already in the team", () => {
      pokemonService.togglePokemonInTeam("1", mockPokemonList[0]);
      const result = pokemonService.togglePokemonInTeam(
        "1",
        mockPokemonList[0],
      );
      expect(result).toBe(true);
      expect(pokemonService.getUserTeam("1")).toEqual([]);
    });

    it("should return false if user team is full", () => {
      pokemonService.togglePokemonInTeam("1", mockPokemonList[0]);
      pokemonService.togglePokemonInTeam("1", mockPokemonList[1]);
      pokemonService.togglePokemonInTeam("1", mockPokemonList[2]);
      pokemonService.togglePokemonInTeam("1", mockPokemonList[3]);
      pokemonService.togglePokemonInTeam("1", mockPokemonList[4]);
      pokemonService.togglePokemonInTeam("1", mockPokemonList[5]);
      const result = pokemonService.togglePokemonInTeam(
        "1",
        mockPokemonList[6],
      );
      expect(result).toBe(false);
      expect(pokemonService.getUserTeam("1")).toEqual([
        mockPokemonList[0],
        mockPokemonList[1],
        mockPokemonList[2],
        mockPokemonList[3],
        mockPokemonList[4],
        mockPokemonList[5],
      ]);
    });
  });
});
