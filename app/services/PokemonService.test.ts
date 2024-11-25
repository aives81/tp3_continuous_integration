import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PokemonService } from "./PokemonService";
import { Pokemon } from "./pokemon";


describe("PokemonService", () => {
    let pokemonService: PokemonService;
    let mockPokeApiClient: { getPokemonList: Mock };

    const mockPokemon: Pokemon = {
        id: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
        sprite: "bulbasaur.png"
    };
    
    const mockPokemon2: Pokemon = {
        id: 2,
        name: "Charmander",
        types: ["fire"],
        sprite: "charmander.png"
    };

    const mockPokemon3: Pokemon = {
        id: 3,
        name: "Squirtle",
        types: ["water"],
        sprite: "squirtle.png"
    };

    const mockPokemon4: Pokemon = {
        id: 4,
        name: "Pikachu",
        types: ["electric"],
        sprite: "pikachu.png"
    };

    const mockPokemon5: Pokemon = {
        id: 5,
        name: "Jigglypuff",
        types: ["fairy"],
        sprite: "jigglypuff.png"
    };

    const mockPokemon6: Pokemon = {
        id: 6,
        name: "Meowth",
        types: ["normal"],
        sprite: "meowth.png"
    };

    const mockPokemon7: Pokemon = {
        id: 7,
        name: "Psyduck",
        types: ["water"],
        sprite: "psyduck.png"
    };

    beforeEach(() => {
        mockPokeApiClient = {
            getPokemonList: vi.fn(),
            baseUrl: "https://pokeapi.co/api/v2"
        } as PokeApiClient;
        pokemonService = new PokemonService(mockPokeApiClient);
    });

    describe("getPokemonList", () => {
        it("should return pokemon list from API client", async () => {
            const expectedPokemonList = [mockPokemon, mockPokemon2];
            mockPokeApiClient.getPokemonList.mockResolvedValue(expectedPokemonList);

            expect(await pokemonService.getPokemonList()).toEqual(expectedPokemonList);
        });        
    });

    describe("getUserTeam", () => {
        it("should return user team", () => {
            pokemonService.togglePokemonInTeam("1", mockPokemon);
            const result = pokemonService.getUserTeam("1");
            expect(result).toEqual([mockPokemon]);
        });

        it("should return empty array if user has no team", () => {
            const result = pokemonService.getUserTeam("1");
            expect(result).toEqual([]);
        });
    });

    describe("clearTeam", () => {
        it("should clear user team", () => {
            pokemonService.togglePokemonInTeam("1", mockPokemon);
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
            const result = pokemonService.togglePokemonInTeam("1", mockPokemon);
            expect(result).toBe(true);
            expect(pokemonService.getUserTeam("1")).toEqual([mockPokemon]);
        });

        it("should remove specified pokemon if already in the team", () => {
            pokemonService.togglePokemonInTeam("1", mockPokemon);
            const result = pokemonService.togglePokemonInTeam("1", mockPokemon);
            expect(result).toBe(true);
            expect(pokemonService.getUserTeam("1")).toEqual([]);
        });

        it("should return false if user team is full", () => {
            pokemonService.togglePokemonInTeam("1", mockPokemon);
            pokemonService.togglePokemonInTeam("1", mockPokemon2);
            pokemonService.togglePokemonInTeam("1", mockPokemon3);
            pokemonService.togglePokemonInTeam("1", mockPokemon4);
            pokemonService.togglePokemonInTeam("1", mockPokemon5);
            pokemonService.togglePokemonInTeam("1", mockPokemon6);
            const result = pokemonService.togglePokemonInTeam("1", mockPokemon7);
            expect(result).toBe(false);
            expect(pokemonService.getUserTeam("1")).toEqual([mockPokemon, mockPokemon2, mockPokemon3, mockPokemon4, mockPokemon5, mockPokemon6]);
        });
    });
});