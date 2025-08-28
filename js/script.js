document.addEventListener('DOMContentLoaded', () => {


    /***************************************************** 
                 Pokemon Cache & Global Variables
    ******************************************************/

    // Store all fetched Pokémon here
    let allPokemon = []; 

    // A global variable to store currently viewed card data
    let currentCardData = null;

    const $pokedexName = document.getElementById("pokedexName");
    const $filterBtn = document.getElementById("filterBtn");
    const $loadMoreBtn = document.getElementById("loadMoreBtn");    
    const $backToPokedex = document.getElementById("backToPokedex");
    const $backToPokedexBtn = document.getElementById("backToPokedexBtn");


    /***************************************************** 
                    Loading Spinner
    ******************************************************/
    
    const spinner = document.getElementById("loading-spinner");
    
    function showLoading() {
        // console.log("Showing spinner...");
        spinner.classList.remove("hidden");
        spinner.classList.add("flex");
    
        // Hide the "Load More Pokémon" button
        if ($loadMoreButton) {
            $loadMoreButton.classList.add("hidden");
        }
    }
    
    function hideLoading() {
        // console.log("Hiding spinner...");
        spinner.classList.remove("flex");
        spinner.classList.add("hidden");
    
        // Show the "Load More Pokémon" button
        if ($loadMoreButton) {
            $loadMoreButton.classList.remove("hidden");
        }
    }


    /***************************************************** 
                            Filter
    ******************************************************/
   
    let currentSort = "number"; // Default sort by ID

    const filterButton = document.getElementById("filter-button");
    const filterPopup = document.getElementById("filter-popup");
    const dropdownOptions = filterPopup.querySelectorAll("div"); // Select all options in the dropdown
    
    // Toggle the dropdown visibility
    filterButton.addEventListener("click", () => {
        filterPopup.classList.toggle("hidden");
    });
    
    // Update the filter button text and apply sorting when an option is clicked
    dropdownOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const selectedOption = option.textContent.trim();
            let sortedPokemon;
    
            // Reset the offset and displayed Pokémon
            offset = 0;
            displayedPokemon = [];
    
            if (selectedOption === "Lowest number first") {
                currentSort = "number"; // Sort by ID
                sortedPokemon = sortByNumber(allPokemon);
            } else if (selectedOption === "A-Z") {
                currentSort = "name"; // Sort alphabetically
                sortedPokemon = sortByName(allPokemon);
            } else if (selectedOption === "By type") { 
                currentSort = "type"; // Sort by type
                sortedPokemon = sortByType(allPokemon);
            }
    
            // Clear and repopulate the Pokémon list with the first page of the new sort
            $pokemonList.innerHTML = ""; // Clear existing cards
            const nextPage = sortedPokemon.slice(offset, offset + limit);
            displayedPokemon = nextPage; // Update displayed Pokémon
            populatePokemonCards(nextPage); // Render the first page
    
            // Increment the offset for the next page
            offset += nextPage.length;
    
            // **Clear the search input and reset search mode here**
            $searchBar.value = "";
            isSearchMode = false;
            searchQuery = "";
    
            // Re-run pagination logic from scratch if necessary
            resetLoadMoreButtonVisibility();
    
            // Update button text
            filterButton.innerHTML = `
                ${selectedOption}
                <svg aria-hidden="true" class="ml-2" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="dark:stroke-white" d="M1.17505 7.0708L2.82882 9.12344C3.05173 9.40012 3.47323 9.40012 3.69615 9.12344L5.34991 7.0708" stroke="black" stroke-opacity="0.78" stroke-width="1.11381" stroke-linecap="round"/>
                    <path class="dark:stroke-white" d="M1.17505 3.62097L2.82882 1.56833C3.05173 1.29165 3.47323 1.29165 3.69615 1.56833L5.34991 3.62097" stroke="black" stroke-opacity="0.78" stroke-width="1.11381" stroke-linecap="round"/>
                </svg>
            `;
            filterPopup.classList.add("hidden"); // Hide dropdown
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!filterButton.contains(event.target) && !filterPopup.contains(event.target)) {
            filterPopup.classList.add("hidden");
        }
    });
    
    // Sorting logic for type precedence
    const typeOrder = [
        "grass", "fire", "water", "bug", "normal", "poison", "electric",
        "ground", "fairy", "fighting", "psychic", "rock", "dragon",
        "ice", "steel", "ghost", "dark", "flying"
    ];
    
    // Sorting functions
    function sortByNumber(pokemonList) {
        return [...pokemonList].sort((a, b) => a.id - b.id);
    }
    
    function sortByName(pokemonList) {
        return [...pokemonList].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    function sortByType(pokemonList) {
        return [...pokemonList].sort((a, b) => {
            const typeA = a.types[0] || "normal"; // Default to "normal" if type is missing
            const typeB = b.types[0] || "normal";
            return typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB);
        });
    }

    /***************************************************** 
                        Tooltip Function
    ******************************************************/

    (function tooltip() {
        const button = document.getElementById('hoverButton');
        const svgContainer = document.getElementById('svgContainer');
        const tooltip = document.getElementById('tooltip');
        const searchContainer = document.querySelector('.search-container');
        const searchInput = searchContainer.querySelector('input');
        
        // Always attach the click event for loading favorites
        svgContainer.addEventListener('click', () => {
            loadFavoritesPage();
        });
    
        // Check screen width before adding tooltip hover events
        const screenWidth = window.innerWidth;
        if (screenWidth >= 590) {
            button.addEventListener('mouseenter', () => {
                svgContainer.classList.add('hover');
                const rect = button.getBoundingClientRect();
                tooltip.style.left = `${rect.left - tooltip.offsetWidth - 155}px`;
                tooltip.style.display = 'block';
                tooltip.classList.remove('hide');
                tooltip.classList.add('slideIn');
            });
    
            button.addEventListener('mouseleave', () => {
                svgContainer.classList.remove('hover');
                tooltip.classList.remove('slideIn');
                tooltip.classList.add('hide');
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 150);
            });
        }
    
        // Search container focus/blur behavior
        searchInput.addEventListener('focus', () => {
            searchContainer.classList.add('hover');
        });
    
        searchInput.addEventListener('blur', () => {
            searchContainer.classList.remove('hover');
        });
    })();

    /***************************************************** 
                    Dark Mode Function
    ******************************************************/

    const darkModeButton = document.getElementById('darkModeButton');
    const htmlElement = document.documentElement;

    // Check if user has a saved preference in localStorage
    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.classList.add('dark');
    }

    darkModeButton.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');

        // Save the user's preference to localStorage
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });


    /***************************************************** 
                    Cmd/Ctl K Search Function
    ******************************************************/

    document.addEventListener('keydown', function (event) {
        // Check if the key combination is Cmd+K or Ctrl+K
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault(); // Prevent the default action of 'Cmd/Ctrl + K'

            const searchBar = document.getElementById('search-bar'); // Adjust to match your search bar's ID

            if (searchBar) {
                if (document.activeElement === searchBar) {
                    // If search bar is already focused, blur it (deselect)
                    searchBar.blur();
                } else {
                    // Otherwise, focus the search bar
                    searchBar.focus();
                }
            }
        }
    });


    /***************************************************** 
                  Fetch and Store Pokémon Data
    ******************************************************/

    const $pokemonList = document.getElementById("pokemonList");
    
    // Helper function to fetch with retry and rate limiting
    async function fetchWithRetry(url, retries = 3, delay = 200) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 429) {
                        const waitTime = delay * (i + 1) * 4; // Increased wait time
                        console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        continue;
                    }
                    throw new Error(`HTTP error! status: ${response.status} for ${url}`);
                }
                
                // Get response text first to debug
                const responseText = await response.text();
                
                // Try to parse as JSON
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error(`JSON parse error for ${url}:`, parseError);
                    console.error(`Response text:`, responseText);
                    throw new Error(`Invalid JSON response: ${parseError.message}`);
                }
                
                return data;
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
                  
    // Cache key for localStorage
    const POKEMON_CACHE_KEY = 'pokemon_cache_v1';
    const CACHE_EXPIRY_KEY = 'pokemon_cache_expiry';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if cache is valid
    function isCacheValid() {
        const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        if (!cacheExpiry) return false;
        return Date.now() < parseInt(cacheExpiry);
    }

    // Load Pokémon from cache
    function loadFromCache() {
        try {
            const cachedData = localStorage.getItem(POKEMON_CACHE_KEY);
            if (cachedData && isCacheValid()) {
                const parsedData = JSON.parse(cachedData);
                console.log(`✅ Loaded ${parsedData.length} Pokémon from cache`);
                return parsedData;
            }
        } catch (error) {
            console.error('Error loading from cache:', error);
        }
        return null;
    }

    // Save Pokémon to cache
    function saveToCache(pokemonData) {
        try {
            localStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(pokemonData));
            localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
            console.log(`💾 Saved ${pokemonData.length} Pokémon to cache`);
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    // Fetch all Pokémon data with caching and progressive loading
    async function fetchAllPokemon() {
        try {
            showLoading();
            
            // First, check if we have cached data
            const cachedPokemon = loadFromCache();
            if (cachedPokemon && cachedPokemon.length > 0) {
                allPokemon = cachedPokemon;
                hideLoading();
                loadNextPage();
                return;
            }

            console.log('🔄 No valid cache found, fetching from API...');
            const cloudinaryBase = 'https://res.cloudinary.com/dgbsgb0af/image/fetch';
            
            // Fetch the list of all Pokémon first
            let allData;
            try {
                allData = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon?limit=717');
                console.log(`✅ Got list of ${allData.results.length} Pokémon`);
            } catch (error) {
                console.error('⚠️ Failed to fetch 717 Pokémon, trying fallback...');
                try {
                    allData = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon?limit=151');
                    console.log(`✅ Got list of ${allData.results.length} Pokémon (fallback)`);
                } catch (fallbackError) {
                    console.error('⚠️ Failed to fetch 151 Pokémon, trying minimal set...');
                    allData = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon?limit=20');
                    console.log(`✅ Got list of ${allData.results.length} Pokémon (minimal set)`);
                }
            }
    
            // Process Pokémon in batches of 100 - fetch ALL data (basic + moves + extended) together
            const pokemonDetails = [];
            const batchSize = 100; // Process 100 at a time
            allPokemon = []; // Initialize so we can show progress
            
            for (let i = 0; i < allData.results.length; i += batchSize) {
                const batch = allData.results.slice(i, i + batchSize);
                const batchNumber = Math.floor(i / batchSize) + 1;
                const totalBatches = Math.ceil(allData.results.length / batchSize);
                
                console.log(`🔄 Loading batch ${batchNumber}/${totalBatches} (Pokémon ${i + 1}-${Math.min(i + batchSize, allData.results.length)}) - Complete data`);
                
                const batchResults = await Promise.all(
                    batch.map(async (pokemon, batchIndex) => {
                        try {
                            // Add small delay between requests in batch
                            if (batchIndex > 0 && batchIndex % 20 === 0) {
                                await new Promise(resolve => setTimeout(resolve, 50));
                            }
                            
                            // Fetch basic Pokémon data
                            const details = await fetchWithRetry(pokemon.url);
            
                            const speciesUrl = details.species.url;
                            const spriteUrl = details.sprites.other['official-artwork'].front_default;
                            const cardImage = `${cloudinaryBase}/w_150,c_scale/${spriteUrl}`;
                            const modalImage = `${cloudinaryBase}/w_600,c_scale/${spriteUrl}`;
            
                            // Create basic Pokémon object
                            const pokeData = {
                                id: details.id,
                                name: details.name,
                                types: details.types.map(t => t.type.name),
                                height: details.height,
                                weight: details.weight,
                                abilities: details.abilities.map(a => a.ability.name),
                                sprites: spriteUrl,
                                cardImage,
                                modalImage,
                                baseStats: {
                                    hp: details.stats[0].base_stat,
                                    attack: details.stats[1].base_stat,
                                    defense: details.stats[2].base_stat,
                                    spAtk: details.stats[3].base_stat,
                                    spDef: details.stats[4].base_stat,
                                    speed: details.stats[5].base_stat,
                                },
                                speciesUrl: speciesUrl
                            };

                            // Fetch species data
                            const speciesData = await fetchWithRetry(pokeData.speciesUrl);
                
                            const genderRate = speciesData.gender_rate;
                            const malePercentage = genderRate === -1 ? '—' : 12.5 * (8 - genderRate);
                            const femalePercentage = genderRate === -1 ? '—' : 12.5 * genderRate;
                
                            const eggGroups = speciesData.egg_groups.map(group => group.name);
                            const speciesName = speciesData.genera.find(genus => genus.language.name === 'en').genus;
                
                            // Fetch evolution chain
                            const evoData = await fetchWithRetry(speciesData.evolution_chain.url);
                            const evolutionDetails = [];
                            {
                                let current = evoData.chain;
                                while (current) {
                                    const evoName = current.species.name;
                                    const evoUrl = current.species.url;
                                    const evoId = evoUrl.split("/").filter(Boolean).pop();
                                    const evoSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`;
                                    const evoThumbnail = `${cloudinaryBase}/w_80,c_scale/${evoSpriteUrl}`;
                                    evolutionDetails.push({
                                        name: evoName,
                                        sprite: evoThumbnail,
                                    });
                                    current = current.evolves_to[0];
                                }
                            }

                            // Fetch moves data (we already have details from above)
                            let moves = [];
                            try {
                                const limitedMoves = details.moves.slice(0, 8);
                                
                                moves = await Promise.all(
                                    limitedMoves.map(async (m) => {
                                        try {
                                            const moveData = await fetchWithRetry(m.move.url);
                                            return {
                                                name: m.move.name,
                                                accuracy: moveData.accuracy !== null ? moveData.accuracy : "—",
                                                damageClass: (moveData.damage_class && moveData.damage_class.name) || "—"
                                            };
                                        } catch (error) {
                                            console.error(`Failed to fetch move ${m.move.name}:`, error);
                                            return {
                                                name: m.move.name,
                                                accuracy: "—",
                                                damageClass: "—"
                                            };
                                        }
                                    })
                                );
                            } catch (error) {
                                console.error(`Failed to fetch moves for ${pokeData.name}:`, error);
                            }

                            // Add all extended details to the Pokémon object
                            pokeData.genderRatio = { male: malePercentage, female: femalePercentage };
                            pokeData.eggGroups = eggGroups;
                            pokeData.eggCycle = speciesData.hatch_counter;
                            pokeData.species = speciesName;
                            pokeData.evolutionDetails = evolutionDetails;
                            pokeData.moves = moves;

                            // Preload modal images and evolution images
                            const preloadImages = [pokeData.modalImage, ...evolutionDetails.map(e => e.sprite)];
                            await Promise.all(preloadImages.map(imgUrl => new Promise((resolve) => {
                                const img = new Image();
                                img.src = imgUrl;
                                img.onload = () => resolve();
                                img.onerror = () => resolve(); // Resolve on error to avoid blocking
                            })));

                            return pokeData;
                        } catch (error) {
                            console.error(`❌ Failed to fetch ${pokemon.name}:`, error.message);
                            return null; // Skip failed Pokémon
                        }
                    })
                );
                
                // Filter out failed requests and add to main array
                const validResults = batchResults.filter(result => result !== null);
                pokemonDetails.push(...validResults);
                
                // Update allPokemon and show current batch on screen immediately
                allPokemon = [...pokemonDetails];
                
                // Show the first batch immediately, subsequent batches will be added
                if (i === 0) {
                    hideLoading(); // Hide loading spinner after first batch
                    offset = 0;
                    displayedPokemon = [];
                    loadNextPage(); // Show first 20 Pokémon
                }
                
                console.log(`✅ Batch ${batchNumber}/${totalBatches} complete (${validResults.length}/${batch.length} successful) - ALL data loaded`);
                
                // Small delay between batches to be respectful to the API
                if (i + batchSize < allData.results.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // Save completed data to cache
            allPokemon = pokemonDetails;
            saveToCache(allPokemon);
            console.log(`🎉 All ${allPokemon.length} Pokémon loaded and cached with complete data!`);
        } catch (error) {
            console.error("Error fetching Pokémon data:", error);
            hideLoading();
            
            // Show user-friendly error message
            const $pokemonList = document.getElementById('pokemonList');
            if ($pokemonList) {
                $pokemonList.innerHTML = `
                    <div class="flex flex-col items-center justify-center min-h-96 px-4 py-8 mx-auto max-w-2xl">
                        <!-- Pokéball Icon -->
                        <div class="mb-6">
                            <svg width="64" height="64" viewBox="0 0 108 111" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-30">
                                <path d="M54.0143 71.014C62.5766 71.014 69.5178 63.9383 69.5178 55.2099C69.5178 46.4815 62.5766 39.4058 54.0143 39.4058C45.4519 39.4058 38.5108 46.4815 38.5108 55.2099C38.5108 63.9383 45.4519 71.014 54.0143 71.014Z" fill="currentColor"/>
                                <path d="M85.6032 61.5866C84.8967 61.5866 84.2776 62.0783 84.1105 62.779C80.7835 76.5776 68.5729 86.8066 54.0113 86.8066C39.4497 86.8066 27.2353 76.5738 23.9083 62.779C23.7412 62.0783 23.1221 61.5866 22.4157 61.5866H1.97097C1.02906 61.5866 0.303639 62.4383 0.440367 63.3869C4.31814 89.9968 26.8213 110.416 54.0113 110.416C81.2013 110.416 103.701 89.9968 107.578 63.3869C107.715 62.4383 106.99 61.5866 106.048 61.5866H85.6032ZM54.0113 0C26.8251 0 4.32193 20.4192 0.440367 47.0291C0.303639 47.9777 1.02906 48.8294 1.97097 48.8294H22.4119C23.1183 48.8294 23.7374 48.3377 23.9045 47.637C27.2315 33.8422 39.4459 23.6094 54.0113 23.6094C68.5767 23.6094 80.7873 33.8461 84.1143 47.637C84.2814 48.3377 84.9005 48.8294 85.607 48.8294H106.048C106.99 48.8294 107.715 47.9777 107.578 47.0291C103.701 20.4192 81.1937 0 54.0113 0Z" fill="currentColor"/>
                            </svg>
                        </div>
                        
                        <!-- Error Title -->
                        <h3 class="text-2xl md:text-3xl font-bold text-gray-700 dark:text-white mb-4 text-center">
                            Unable to Load Pokémon
                        </h3>
                        
                        <!-- Error Description -->
                        <p class="text-gray-600 dark:text-gray-300 mb-6 text-center text-base md:text-lg leading-relaxed">
                            We're having trouble connecting to the Pokémon database. This might be due to:
                        </p>
                        
                        <!-- Error Reasons List -->
                        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8 w-full max-w-md">
                            <ul class="space-y-3 text-gray-600 dark:text-gray-300">
                                <li class="flex items-start">
                                    <span class="text-red-500 mr-3 mt-0.5">•</span>
                                    <span class="text-sm md:text-base">Network connectivity issues</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-red-500 mr-3 mt-0.5">•</span>
                                    <span class="text-sm md:text-base">Pokémon API service being temporarily unavailable</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-red-500 mr-3 mt-0.5">•</span>
                                    <span class="text-sm md:text-base">Rate limiting from too many requests</span>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- Try Again Button -->
                        <button 
                            onclick="location.reload()" 
                            class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-transform"
                        >
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                Try Again
                            </span>
                        </button>
                    </div>
                `;
            }
        }
    }
   

    /***************************************************** 
            Pokémon Homepage Load & Search Function
    ******************************************************/
    
    const $searchIcon = document.getElementById("searchIcon");
    const $searchIconDark = document.getElementById("searchIconDark");
    const $mobileSearchOverlay = document.getElementById("mobileSearchOverlay");
    const $mobileSearchBar = document.getElementById("mobile-search-bar");
    const $loadMoreButton = document.getElementById("loadMoreButton");
    const $searchBar = document.getElementById("search-bar");
    const limit = 20; // Number of Pokémon to display per page
    let displayedPokemon = []; // Pokémon currently displayed
    let offset = 0; // Starting index for pagination
    let isSearchMode = false; // Toggle for search mode
    let searchQuery = ""; // Current search query
    
    // Load the next page of Pokémon for display
    function loadNextPage() {
        let sortedPokemon;
    
        // Sort the full list based on the current sort
        if (currentSort === "number") {
            sortedPokemon = sortByNumber(allPokemon);
        } else if (currentSort === "name") {
            sortedPokemon = sortByName(allPokemon);
        } else if (currentSort === "type") {
            sortedPokemon = sortByType(allPokemon);
        }
    
        // Get the next set of Pokémon based on the offset and limit
        const nextPage = sortedPokemon.slice(offset, offset + limit);
        displayedPokemon = displayedPokemon.concat(nextPage); // Append to displayed Pokémon
        offset += limit; // Update offset
    
        // Populate cards for the next page
        populatePokemonCards(nextPage);
    }
    
    // Helper function to format Pokémon ID
    function formatPokeId(id) {
        if (id >= 1000) {
            const numberInThousands = id / 1000;
            return `#${numberInThousands.toFixed(2)}K`; 
            // e.g. 10060 -> 10060/1000 = 10.06 -> "10.06K"
        } else {
            return `#${id.toString().padStart(3, '0')}`; 
            // e.g. 142 -> "#142"
        }
    }

    // Helper function to format the Pokémon's name
    function formatPokemonName(name) {
        let displayName;
        if (name.includes('-')) {
            // If there's a hyphen, split, capitalize each part, and join with space
            const parts = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1));
            displayName = parts.join(' ');
        } else {
            // Otherwise, just capitalize normally
            displayName = name.charAt(0).toUpperCase() + name.slice(1);
        }
        return displayName;
    }

    async function populatePokemonCards(pokemonList) {
        const $pokemonList = document.getElementById('pokemonList');
        if (!$pokemonList) return;
    
        // Create an array to store all the generated card HTML
        const cards = [];
    
        pokemonList.forEach((pokemon) => {
            // Resolve the primary type
            const primaryType = pokemon.types[0] || "normal"; // fallback if no type exists
    
            // List of valid types for colors
            const validTypes = [
                "grass", "fire", "water", "bug", "normal", "poison", "electric",
                "ground", "fairy", "fighting", "psychic", "rock", "dragon",
                "ice", "steel", "ghost", "dark", "flying"
            ];
    
            // Resolve the background color type or default to "normal"
            const resolvedType = validTypes.includes(primaryType) ? primaryType : "normal";
    
            // Build the type HTML
            const pokemonTypes = pokemon.types.map((type) => `
                <p class="bg-white text-white font-bold text-xs 3sm:text-sm bg-opacity-[15%] rounded-full px-2 3sm:px-4 py-0.5">
                    ${type}
                </p>
            `).join("");
    
            // Format ID and name
            const formattedId = formatPokeId(pokemon.id);
            const displayName = formatPokemonName(pokemon.name);
            const nameClass = displayName.length > 9 ? 'text-base 3sm:text-lg' : 'text-lg 3sm:text-xl';
    
            // Check device dimensions for special layout
            const isSpecialDevice = (
                (window.innerWidth === 344 && window.innerHeight === 882) ||
                (window.innerWidth === 882 && window.innerHeight === 344) ||
                (window.innerWidth === 375 && window.innerHeight === 667) ||
                (window.innerWidth === 667 && window.innerHeight === 375) ||
                (window.innerWidth === 820 && window.innerHeight === 1180) ||
                (window.innerWidth === 1180 && window.innerHeight === 820)
            );
    
            let cardHTML;
    
            // Use "long name" layout if name = 16 chars OR special device dimensions
            if ((displayName.length >= 16 && displayName.length <= 18) || isSpecialDevice) {
                cardHTML = `
                    <div class="pokemon-card bg-${resolvedType} relative flex pokemonColor flex-col justify-between w-62 rounded-[24px] px-4 pt-6 3.5xs:pt-4 pb-2 overflow-hidden hover:cursor-pointer transform border-2 border-transparent hover:border-black/20 dark:hover:border-white/60 dark:hover:border-opacity-60 transition-all duration-300 ease-in-out shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.4), inset_0_0_0_2px_rgba(128,128,128,1)] group"
                        data-id="${pokemon.id}"
                        data-name="${pokemon.name}"
                        data-types='${JSON.stringify(pokemon.types)}'
                        data-height="${pokemon.height}"
                        data-weight="${pokemon.weight}"
                        data-abilities='${JSON.stringify(pokemon.abilities)}'
                        data-sprites="${pokemon.sprites}"
                        data-base-stats='${JSON.stringify(pokemon.baseStats)}'
                        data-species-url="${pokemon.speciesUrl}"
                    >
                        <div class="relative w-full">
                            <!-- ID absolutely positioned top-right -->
                            <p id="pokemonNumber" role="text" aria-label="Pokémon Number"
                                class="opacity-15 font-extrabold text-sm 2sx:text-base absolute -top-2 -right-1">
                                ${formattedId}
                            </p>
                            <h2 id="pokemonName"
                                class="text-white font-bold ${nameClass} mt-2 mb-1">
                                ${displayName}
                            </h2>
                        </div>
    
                        <div class="flex 3.5xs:justify-between justify-start">
                            <div class="flex flex-col gap-2 mt-6">
                                ${pokemonTypes}
                            </div>
                            <div class="relative flex items-center">
                                <div class="absolute opacity-25 -bottom-10">
                                    <!-- Poké Ball SVG -->
                                    <svg width="130" height="133" viewBox="0 0 108 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M54.0143 71.014C62.5766 71.014 69.5178 63.9383 69.5178 55.2099C69.5178 46.4815 62.5766 39.4058 54.0143 39.4058C45.4519 39.4058 38.5108 46.4815 38.5108 55.2099C38.5108 63.9383 45.4519 71.014 54.0143 71.014Z" fill="white"/>
                                        <path d="M85.6032 61.5866C84.8967 61.5866 84.2776 62.0783 84.1105 62.779C80.7835 76.5776 68.5729 86.8066 54.0113 86.8066C39.4497 86.8066 27.2353 76.5738 23.9083 62.779C23.7412 62.0783 23.1221 61.5866 22.4157 61.5866H1.97097C1.02906 61.5866 0.303639 62.4383 0.440367 63.3869C4.31814 89.9968 26.8213 110.416 54.0113 110.416C81.2013 110.416 103.701 89.9968 107.578 63.3869C107.715 62.4383 106.99 61.5866 106.048 61.5866H85.6032ZM54.0113 0C26.8251 0 4.32193 20.4192 0.440367 47.0291C0.303639 47.9777 1.02906 48.8294 1.97097 48.8294H22.4119C23.1183 48.8294 23.7374 48.3377 23.9045 47.637C27.2315 33.8422 39.4459 23.6094 54.0113 23.6094C68.5767 23.6094 80.7873 33.8461 84.1143 47.637C84.2814 48.3377 84.9005 48.8294 85.607 48.8294H106.048C106.99 48.8294 107.715 47.9777 107.578 47.0291C103.701 20.4192 81.1937 0 54.0113 0Z" fill="white"/>
                                    </svg>
                                </div>
                                <img id="pokemonImg" src="${pokemon.cardImage}" alt="${pokemon.name}" class="relative max-h-24 max-w-24 right-0 3sm:max-h-24 3sm:max-w-24 3sm:-right-2 group-hover:scale-105 transition-transform duration-200 ease-in-out">
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Regular layout
                cardHTML = `
                    <div class="pokemon-card bg-${resolvedType} relative flex pokemonColor flex-col justify-between w-62 rounded-[24px] px-4 pt-6 3.5xs:pt-4 pb-2 overflow-hidden hover:cursor-pointer transform border-2 border-transparent hover:border-black/20 dark:hover:border-white/60 dark:hover:border-opacity-60 transition-all duration-300 ease-in-out shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.4), inset_0_0_0_2px_rgba(128,128,128,1)] group"
                        data-id="${pokemon.id}"
                        data-name="${pokemon.name}"
                        data-types='${JSON.stringify(pokemon.types)}'
                        data-height="${pokemon.height}"
                        data-weight="${pokemon.weight}"
                        data-abilities='${JSON.stringify(pokemon.abilities)}'
                        data-sprites="${pokemon.sprites}"
                        data-base-stats='${JSON.stringify(pokemon.baseStats)}'
                        data-species-url="${pokemon.speciesUrl}"
                    >
                        <div class="relative w-full">
                            <!-- ID absolutely positioned top-right -->
                            <p id="pokemonNumber" role="text" aria-label="Pokémon Number"
                                class="opacity-15 font-extrabold text-sm 2sx:text-base absolute top-0 right-0">
                                ${formattedId}
                            </p>
                            <h2 id="pokemonName"
                                class="text-white font-bold ${nameClass} mt-2 mb-1">
                                ${displayName}
                            </h2>
                        </div>
    
                        <div class="flex 3.5xs:justify-between justify-start">
                            <div class="flex flex-col gap-2 mt-6">
                                ${pokemonTypes}
                            </div>
                            <div class="relative flex items-center">
                                <div class="absolute opacity-25 -bottom-10">
                                    <!-- Poké Ball SVG -->
                                    <svg width="130" height="133" viewBox="0 0 108 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M54.0143 71.014C62.5766 71.014 69.5178 63.9383 69.5178 55.2099C69.5178 46.4815 62.5766 39.4058 54.0143 39.4058C45.4519 39.4058 38.5108 46.4815 38.5108 55.2099C38.5108 63.9383 45.4519 71.014 54.0143 71.014Z" fill="white"/>
                                        <path d="M85.6032 61.5866C84.8967 61.5866 84.2776 62.0783 84.1105 62.779C80.7835 76.5776 68.5729 86.8066 54.0113 86.8066C39.4497 86.8066 27.2353 76.5738 23.9083 62.779C23.7412 62.0783 23.1221 61.5866 22.4157 61.5866H1.97097C1.02906 61.5866 0.303639 62.4383 0.440367 63.3869C4.31814 89.9968 26.8213 110.416 54.0113 110.416C81.2013 110.416 103.701 89.9968 107.578 63.3869C107.715 62.4383 106.99 61.5866 106.048 61.5866H85.6032ZM54.0113 0C26.8251 0 4.32193 20.4192 0.440367 47.0291C0.303639 47.9777 1.02906 48.8294 1.97097 48.8294H22.4119C23.1183 48.8294 23.7374 48.3377 23.9045 47.637C27.2315 33.8422 39.4459 23.6094 54.0113 23.6094C68.5767 23.6094 80.7873 33.8461 84.1143 47.637C84.2814 48.3377 84.9005 48.8294 85.607 48.8294H106.048C106.99 48.8294 107.715 47.9777 107.578 47.0291C103.701 20.4192 81.1937 0 54.0113 0Z" fill="white"/>
                                    </svg>
                                </div>
                                <img id="pokemonImg" src="${pokemon.cardImage}" alt="${pokemon.name}" class="relative max-h-24 max-w-24 right-0 3sm:max-h-24 3sm:max-w-24 3sm:-right-2 group-hover:scale-105 transition-transform duration-200 ease-in-out">
                            </div>
                        </div>
                    </div>
                `;
            }
    
            cards.push(cardHTML);
        });
    
        const fullHTML = cards.join("");
    
        // Preload images before appending to the DOM
        const imagePromises = pokemonList.map(pokemon => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = pokemon.cardImage;
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Resolve on error as well
            });
        });
    
        await Promise.all(imagePromises);
    
        // Once all images are loaded, append to the DOM
        $pokemonList.innerHTML += fullHTML;
    }
    
    // Search Pokémon by name, ID, or type locally
    function searchPokemon(query) {
        const filteredPokemon = allPokemon.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query) || // Match by name
            pokemon.id.toString() === query || // Match by ID
            pokemon.types.some((type) => type.toLowerCase().includes(query)) // Match by type
        );

        $pokemonList.innerHTML = ""; // Clear the list
        displayedPokemon = filteredPokemon.slice(0, limit); // Update displayed Pokémon for the first page
        isFavoritesPageActive = false
        $pokedexName.textContent = "Pokédex";
        $filterBtn.classList.remove("hidden");
        $loadMoreBtn.classList.remove("hidden");
        $backToPokedex.classList.add("hidden");
        populatePokemonCards(displayedPokemon); // Display the filtered results
    }

    function showMobileSearchOverlay() {
        $mobileSearchOverlay.classList.remove("hidden-override");
        $mobileSearchBar.focus();
    }
    
    function hideMobileSearchOverlay() {
        $mobileSearchOverlay.classList.add("hidden-override");
        $mobileSearchBar.value = "";
        if (!searchQuery) {
            isSearchMode = false;
            $pokemonList.innerHTML = "";
            offset = 0;
            displayedPokemon = [];
            loadNextPage();
        }
    }
    
    $searchIcon.addEventListener("click", showMobileSearchOverlay);
    $searchIconDark.addEventListener("click", showMobileSearchOverlay);
    
    $mobileSearchOverlay.addEventListener("click", (event) => {
        if (event.target === $mobileSearchOverlay) {
            hideMobileSearchOverlay();
        }
    });
    
    $mobileSearchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase().trim();
        if (query) {
            isSearchMode = true;
            searchQuery = query;
            searchPokemon(query);
        } else {
            isSearchMode = false;
            $pokemonList.innerHTML = "";
            offset = 0;
            displayedPokemon = [];
            loadNextPage();
        }
        resetLoadMoreButtonVisibility();
    });

    // Function to reset and update the Load More button visibility
    function resetLoadMoreButtonVisibility() {
        if (isSearchMode) {
            const searchResults = allPokemon.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchQuery) || // Match by name
                pokemon.id.toString() === searchQuery || // Match by ID
                pokemon.types.some((type) => type.toLowerCase().includes(searchQuery)) // Match by type
            );

            if (searchResults.length > displayedPokemon.length) {
                $loadMoreButton.classList.remove("hidden"); // Show button if there are more search results
            } else {
                $loadMoreButton.classList.add("hidden"); // Hide button if no more search results
            }
        } else {
            if (offset < allPokemon.length) {
                $loadMoreButton.classList.remove("hidden"); // Show button if there are more Pokémon to load
            } else {
                $loadMoreButton.classList.add("hidden"); // Hide button if all Pokémon are loaded
            }
        }
    }

    // Handle input in the search bar (merged logic)
    $searchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase().trim(); // Trim whitespace for clean queries
        if (query) {
            isSearchMode = true;
            searchQuery = query;
            searchPokemon(query); // Perform the search and display results
        } else {
            isSearchMode = false;
            $pokemonList.innerHTML = ""; // Clear the list
            offset = 0; // Reset offset
            displayedPokemon = []; // Reset displayed Pokémon
            loadNextPage(); // Reload the initial page of Pokémon

            // Logic from the first listener's else-block
            isFavoritesPageActive = false;
            $pokedexName.textContent = "Pokédex";
            $filterBtn.classList.remove("hidden");
            $loadMoreBtn.classList.remove("hidden");
            $backToPokedex.classList.add("hidden");
        }

        // Moved from the second listener so we still update button visibility
        resetLoadMoreButtonVisibility();
    });

    // Function to load the next page of Pokémon
    function loadNextPage() {
        let sortedPokemon;
    
        // Determine the list of Pokémon to paginate (filtered or full list)
        if (isSearchMode) {
            // Filter Pokémon based on the search query
            sortedPokemon = allPokemon.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchQuery) || // Match by name
                pokemon.id.toString() === searchQuery || // Match by ID
                pokemon.types.some((type) => type.toLowerCase().includes(searchQuery)) // Match by type
            );
        } else {
            // Sort the full list based on the current sort
            if (currentSort === "number") {
                sortedPokemon = sortByNumber(allPokemon);
            } else if (currentSort === "name") {
                sortedPokemon = sortByName(allPokemon);
            } else if (currentSort === "type") {
                sortedPokemon = sortByType(allPokemon);
            }
        }
    
        // Get the next set of Pokémon based on the offset and limit
        const nextPage = sortedPokemon.slice(offset, offset + limit);
        displayedPokemon = displayedPokemon.concat(nextPage); // Append to displayed Pokémon
        offset += nextPage.length; // Update offset dynamically based on the number loaded
    
        // Populate cards for the next page
        populatePokemonCards(nextPage);
    
        // Update Load More button visibility
        resetLoadMoreButtonVisibility();
    }

    // Modify the loadMoreButton click handler
    $loadMoreButton.addEventListener("click", () => {
        if (isSearchMode) {
            // Handle pagination for search results
            const searchResults = allPokemon.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchQuery) || // Match by name
                pokemon.id.toString() === searchQuery || // Match by ID
                pokemon.types.some((type) => type.toLowerCase().includes(searchQuery)) // Match by type
            );

            const nextSearchPage = searchResults.slice(displayedPokemon.length, displayedPokemon.length + limit);
            displayedPokemon = displayedPokemon.concat(nextSearchPage);
            populatePokemonCards(nextSearchPage);
        } else {
            loadNextPage(); // Load the next page for the full list
        }

        resetLoadMoreButtonVisibility(); // Update button visibility after loading more
    });

    // Fetch and load Pokémon data initially
    fetchAllPokemon().then(() => {
        resetLoadMoreButtonVisibility(); // Ensure button visibility is correct after the initial fetch
    });
    
    
    /***************************************************** 
    Side Pokémon Modal Open/Close & About Page Population
    ******************************************************/

    const modal = document.getElementById('side-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const closeModalButton = document.getElementById('close-modal-button');
    let isModalOpen = false;

    async function openModal(arg) {
        let pokeData;
    
        // Determine if arg is a card element or a Pokémon object from allPokemon
        if (arg instanceof HTMLElement && arg.classList.contains('pokemon-card')) {
            // arg is a card element
            const id = Number(arg.dataset.id);
            // Find the Pokémon data from allPokemon using the id
            pokeData = allPokemon.find(p => p.id === id);
        } else if (typeof arg === 'object' && arg !== null && 'id' in arg) {
            // arg is a Pokémon object from allPokemon
            pokeData = arg;
        } else {
            console.error("Invalid argument passed to openModal");
            return;
        }
    
        // Use cached moves data if available, otherwise fetch as fallback
        let moves = [];
        
        if (pokeData.moves && pokeData.moves.length > 0) {
            // Use cached moves data for instant modal opening
            moves = pokeData.moves;
        } else {
            // Fallback: fetch moves data if not cached (shouldn't happen with new system)
            console.log(`⚠️ No cached moves for ${pokeData.name}, fetching...`);
            try {
                const details = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${pokeData.id}`);
                const limitedMoves = details.moves.slice(0, 8);
                moves = await Promise.all(
                    limitedMoves.map(async (m) => {
                        try {
                            const moveData = await fetchWithRetry(m.move.url);
                            return {
                                name: m.move.name,
                                accuracy: moveData.accuracy !== null ? moveData.accuracy : "—",
                                damageClass: (moveData.damage_class && moveData.damage_class.name) || "—"
                            };
                        } catch (error) {
                            return {
                                name: m.move.name,
                                accuracy: "—",
                                damageClass: "—"
                            };
                        }
                    })
                );
            } catch (error) {
                console.error(`Failed to fetch moves for ${pokeData.name}:`, error);
                moves = []; // Empty moves array if fetch fails
            }
        }
    
        // Now construct currentCardData using data from pokeData (already pre-fetched)
        // pokeData now already has species, eggGroups, genderRatio, speciesName, evolutionDetails, etc.
    
        currentCardData = {
            id: pokeData.id,
            name: pokeData.name,
            height: pokeData.height,
            weight: pokeData.weight,
            abilities: pokeData.abilities,
            image: pokeData.modalImage, // Keep your modal image for the modal display
            cardImage: pokeData.cardImage, // Add this line to ensure favorites have cardImage
            types: pokeData.types,
            baseStats: pokeData.baseStats,
            moves: moves, // Just fetched moves remain here
            genderRatio: pokeData.genderRatio,
            eggGroups: pokeData.eggGroups,
            eggCycle: pokeData.eggCycle,
            evolutionDetails: pokeData.evolutionDetails,
            species: pokeData.species
        };
    
        populateModal(); 
        toggleModal();
        document.body.classList.add('modal-open');
    }

    // Toggle modal visibility
    function toggleModal() {
        isModalOpen = !isModalOpen;
        modal.classList.toggle('translate-x-full', !isModalOpen);
        modalBackdrop.classList.toggle('hidden', !isModalOpen);
    
        if (!isModalOpen) {
            currentCardData = null; // clear data for next Pokémon
            document.body.classList.remove('modal-open'); // remove the class here
        }
    }

    closeModalButton.addEventListener('click', toggleModal);

    document.addEventListener('click', (event) => {
        if (isModalOpen && !modal.contains(event.target)) {
            toggleModal();
        }
    });

    // Add event listener to Pokémon cards
    document.addEventListener('click', (event) => {
        const card = event.target.closest('.pokemon-card'); 
        if (card) {
            openModal(card);
        }
    });

    let cachedAboutContent = ""; // Cache for the "About" section content

    function populateModal() {
        // Height and Weight Conversion function defined first
        function convertHeightAndWeight(heightCm, weightKg) {
            // Convert cm to total inches
            const totalInches = heightCm / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = (totalInches % 12).toFixed(1); // Keep one decimal place for inches
    
            // Construct the height string based on feet and inches
            const height =
                feet > 0
                    ? `${feet}’${inches}"`
                    : `${inches}"`; // Only display inches if feet is 0
    
            // Convert kg to lbs
            let pounds = (weightKg * 2.20462).toFixed(1); // Keep one decimal place for pounds
    
            // Remove .0 from pounds if it ends with .0
            if (pounds.endsWith('.0')) {
                pounds = parseInt(pounds); // Convert to integer to remove .0
            }
    
            return {
                height: height,
                weight: `${pounds} lbs`
            };
        }
    
        // Reset active tab to "About"
        setActiveButton($aboutBtn);
    
        // Take the original name from currentCardData
        let rawName = currentCardData.name;
    
        // Split on hyphens and capitalize each word, then join with spaces
        const formattedName = rawName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    
        // Update the modal name element
        const $modelName = document.getElementById('modelName');
        $modelName.textContent = formattedName;
    
        // Increase line-height (add Tailwind class or inline style)
        $modelName.classList.add('my-custom-lineheight');
    
        // Update modal number and image
        document.getElementById('modelNumber').textContent = `#${currentCardData.id.toString().padStart(3, '0')}`;
        document.getElementById('pokemonModal').src = currentCardData.image;
    
        let types = currentCardData.types;
        let firstType = types[0].toLowerCase();
    
        if (types.length > 1) {
            document.getElementById('modelTypeBg').innerHTML = types
                .map((type) => {
                    const firstTypeForBg = firstType; 
                    return `
                        <div class="bg-${firstTypeForBg} text-white font-bold text-xs md:text-base rounded-full px-5 md:px-10 w-fit py-1.5">
                            ${type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>`;
                })
                .join(''); 
        } else {
            document.getElementById('modelTypeBg').innerHTML = types
                .map((type) => {
                    return `
                        <div class="bg-${types} text-white font-bold text-xs md:text-base rounded-full px-5 md:px-10 w-fit py-1.5">
                            ${type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>`;
                })
                .join(''); 
        }
    
        // Ensure firstType is valid
        const validTypes = [
            'grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric',
            'ground', 'fairy', 'fighting', 'psychic', 'rock', 'dragon',
            'ice', 'steel', 'ghost', 'dark', 'flying',
        ];
        if (!validTypes.includes(firstType)) {
            console.warn(`Unknown type: ${firstType}. Falling back to 'normal'.`);
            firstType = 'normal';
        }
    
        // Store firstType in currentCardData for later use
        currentCardData.firstType = firstType;
    
        // Update modal background gradient
        const modalElement = document.getElementById('side-modal');
        modalElement.className = `overflow-clip fixed top-0 right-0 h-screen max-w-[510px] w-full bg-gradient-to-b from-${firstType}-gradient-2 shadow-inner-left to-${firstType}-gradient transform translate-x-full transition-transform duration-300 ease-in-out z-30 md:rounded-b-3xl md:shadow-lg`;
    
        // Background item colors
        const $pokeballModal = document.querySelectorAll(".pokeballModal");
    
        $pokeballModal.forEach((element) => {
            // Remove previous fill-* classes
            element.classList.forEach((cls) => {
                if (cls.startsWith('fill-')) {
                    element.classList.remove(cls);
                }
            });
        
            // Add the new secondary fill class
            element.classList.add(`fill-${firstType}2`);
        });
    
        const converted = convertHeightAndWeight(currentCardData.height, currentCardData.weight);
        const abilities = currentCardData.abilities
            .slice(0, 2) // Take only the first two abilities
            .map(ability => ability.charAt(0).toUpperCase() + ability.slice(1))
            .join(', ');
    
        // Egg groups
        const eggGroups = currentCardData.eggGroups.map(group => group.charAt(0).toUpperCase() + group.slice(1));
        const eggGroupsText = eggGroups.join(', ');
    
        // Gender
        const genderData = currentCardData.genderRatio; 
    
        // Species
        const speciesWithoutPokemon = currentCardData.species.replace(/ Pokémon$/, '');
    
        // Build the "About" section content directly here
        const aboutContent = `<div class="max-w-[85%] mx-auto pt-8 md:pt-12 tall:pt-14">
            <div class="flex gap-10">
                <div class="flex flex-col gap-2 text-2s leading-4 font-bold opacity-30 mb-6 dark:text-white dark:opacity-60 lg:text-sm">
                    <p>Species</p>
                    <p>Height cm</p>
                    <p>Weight kg</p>
                    <p>Abilities</p>
                </div>
                <div class="flex flex-col gap-2 text-2s lg:text-sm leading-4 font-bold dark:text-white">
                    <p>${speciesWithoutPokemon}</p>
                    <p>${converted.height} (${currentCardData.height} cm)</p>
                    <p>${converted.weight} (${currentCardData.weight} kg)</p>
                    <p>${abilities}</p>
                </div>
            </div>
            <!-- Breeding -->
            <p class="font-bold text-2s pb-2 dark:text-white lg:text-sm lg:leading-normal">Breeding</p>
            <div class="flex gap-5">
                <div class="flex flex-col gap-2 text-2s lg:text-sm lg:leading-normal leading-4 font-bold opacity-30 dark:text-white dark:opacity-60">
                    <p>Gender</p>
                    <p>Egg Groups</p>
                    <p>Egg Cycle</p>
                </div>
                <div class="flex flex-col gap-2 text-2s lg:text-sm lg:leading-normal leading-4 font-bold dark:text-white">
                    <!-- Gender -->
                    <div class="flex gap-6">
                        <div class="flex gap-1 items-center">
                            <!-- Male -->
                            <svg width="12" height="12" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.93082 3.91733C6.78585 3.07417 7.60525 2.25477 8.49591 1.36411H5.94269V0.449707H10.1347V4.6061H9.26781V2.26664C8.44841 3.07417 7.60525 3.90545 6.73835 4.7486C7.74776 6.25678 7.5815 8.35873 5.77644 9.64127C4.36327 10.6388 2.42757 10.4369 1.22816 9.20188C-0.00688551 7.94309 -0.12564 6.04302 0.943147 4.64173C2.09506 3.12167 3.912 2.86042 5.93082 3.91733ZM3.74574 9.35626C5.18267 9.35626 6.35833 8.2281 6.38208 6.81493C6.40584 5.36613 5.24204 4.17859 3.78137 4.16671C2.34445 4.16671 1.16878 5.29487 1.14503 6.70805C1.12128 8.15685 2.28507 9.34439 3.74574 9.35626Z" fill="#2196F3"/>
                            </svg>
                            <p>${genderData.male}%</p>
                        </div>
                        <div class="flex gap-1 items-center">
                            <!-- Female -->
                            <svg width="8" height="13" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.13761 11.9693H3.17025V10.0984H1.29932V9.15226H3.1171V7.21755C0.959155 6.37776 0.0130591 5.01708 0.363859 3.26309C0.704028 1.5835 2.08596 0.477951 3.78681 0.520472C5.38135 0.562993 6.69951 1.76422 6.96526 3.41191C7.23102 5.10212 6.18925 6.51595 4.15887 7.19629V9.10974H5.98728V10.0771H4.14824V11.9693H4.13761ZM6.04043 3.82649C6.0298 2.47644 4.94551 1.43468 3.59547 1.45594C2.26668 1.4772 1.24617 2.51897 1.24617 3.85838C1.24617 5.20843 2.3092 6.27146 3.65925 6.26083C4.99866 6.26083 6.05106 5.17654 6.04043 3.82649Z" fill="#FF9CEF"/>
                            </svg>
                            <p>${genderData.female}%</p>
                        </div>
                    </div>
                    <p>${eggGroupsText}</p>
                    <p>${currentCardData.eggCycle}</p>
                </div>
            </div>
        </div>`;
        
        cachedAboutContent = aboutContent;
        
        // Insert the about content directly
        document.getElementById('pokemonInfo').innerHTML = aboutContent;
    
        // Set up the heart button
        const heartButton = document.getElementById('heart-button');
    
        // If heart-button or currentCardData not available, exit silently (no errors)
        if (!heartButton || !currentCardData || !currentCardData.id) {
            return;
        }
        
        function isPokemonFavorited(id) {
            return getFavorites().some(p => p.id === id);
        }

        function toggleFavorite(pokemon) {
            const favorites = getFavorites();
            const index = favorites.findIndex(p => p.id === pokemon.id);
            if (index === -1) {
                // Adding a new favorite
                // Make sure pokemon.cardImage is defined at this point
                favorites.push({ 
                    ...pokemon, 
                    cardImage: pokemon.cardImage 
                });
            } else {
                favorites.splice(index, 1);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    
        // Construct the fill class based on the type
        const fillClass = `fill-${firstType}2`;
    
        const heartPath = heartButton.querySelector('#heart-path');
    
        // Function to update heart appearance
        function updateHeartAppearance() {
            // First remove any previously added fill-* classes
            heartPath.classList.forEach(cls => {
                if (cls.startsWith('fill-')) {
                    heartPath.classList.remove(cls);
                }
            });
    
            // If it's a favorite, add the type-based fill class
            if (isPokemonFavorited(currentCardData.id)) {
                heartPath.classList.add(fillClass);
            } 
            // If not a favorite, no fill class needed
        }
    
        // Set initial heart appearance
        updateHeartAppearance();
    
        // Attach click handler
        heartButton.onclick = () => {
            toggleFavorite(currentCardData);
    
            // Update heart appearance after toggling
            updateHeartAppearance();
    
            // Update the count
            updateFavoriteCount();
    
            // If currently on the favorites page, re-load it to reflect changes
            if (isFavoritesPageActive) {
                loadFavoritesPage();
            }
        };
    }


    /***************************************************** 
                Bottom Pokémon Info in Modal
    ******************************************************/

    const $baseStats = document.getElementById('pokemonInfo');
    const $infoContainer = document.getElementById('infoContainer');
    const $aboutBtn = document.getElementById('aboutBtn');
    const $baseBtn = document.getElementById('baseBtn');
    const $evolutionBtn = document.getElementById('evolutionBtn');
    const $movesBtn = document.getElementById('movesBtn');

    // Helper function to set active class for selected button
    function setActiveButton(activeButton) {
        let types = currentCardData.types;
        let firstType = types[0].toLowerCase();
        // Define active and inactive class sets
        const activeClasses = `p-2 border-b-2 border-${firstType}`;
        const inactiveClasses = 'p-2 border-b-2 border-transparent opacity-60 hover:opacity-90';

        // Array of all buttons
        const buttons = [$aboutBtn, $baseBtn, $evolutionBtn, $movesBtn];

        // Loop through each button and set the appropriate classes
        buttons.forEach((button) => {
            if (button === activeButton) {
                button.className = activeClasses; // Set active classes
            } else {
                button.className = inactiveClasses; // Set inactive classes
            }
        });
    }

    // Modal Tab Info
    $infoContainer.addEventListener('click', (event) => {
        event.preventDefault();
    
        const clickedButton = event.target.closest('button');
        if (!clickedButton) return; // Ignore clicks outside buttons
    
        if ([$aboutBtn, $baseBtn, $evolutionBtn, $movesBtn].includes(clickedButton)) {
            setActiveButton(clickedButton);
            let types = currentCardData.types;
            let firstType = types[0].toLowerCase();
    
            switch (clickedButton.id) {
                case 'aboutBtn':
                    $baseStats.innerHTML = cachedAboutContent;
                    break;
    
                case 'baseBtn':
                        const stats = currentCardData.baseStats;
                        const { hp, attack, defense, spAtk, spDef, speed } = stats;
                        
                        // Create capped values for the bars
                        const displayHp = Math.min(hp, 100);
                        const displayAttack = Math.min(attack, 100);
                        const displayDefense = Math.min(defense, 100);
                        const displaySpAttack = Math.min(spAtk, 100);
                        const displaySpDefense = Math.min(spDef, 100);
                        const displaySpeed = Math.min(speed, 100);
                        
                        $baseStats.innerHTML = `
                            <div class="max-w-[85%] mx-auto pt-12 tall:pt-14 tallxl:pt-16 pb-12">
                                <div class="flex gap-14 max-w-full items-start">
                                    <!-- Labels Column -->
                                    <div class="flex flex-col gap-2 tallxl:gap-3 font-bold text-xs xs:text-sm dark:text-white">
                                        <p class="opacity-60 dark:opacity-75">HP</p>
                                        <p class="opacity-60 dark:opacity-75">Attack</p>
                                        <p class="opacity-60 dark:opacity-75">Defense</p>
                                        <p class="opacity-60 dark:opacity-75">Sp. Atk</p>
                                        <p class="opacity-60 dark:opacity-75">Sp. Def</p>
                                        <p class="opacity-60 dark:opacity-75">Speed</p>
                                    </div>
                                    
                                    <!-- Bars Column -->
                                    <div class="flex flex-col gap-2 tallxl:gap-3 font-bold text-xs xs:text-sm w-full dark:text-white">
                                        <div class="flex items-center gap-3 w-full">
                                            <p class="mr-9 w-12 text-right">${hp}</p>
                                            <div class="bg-gray-100 dark:bg-[#434C5B] h-2.5 w-full relative rounded-md">
                                                <div class="fill-bar h-full rounded-md bg-gradient-to-r from-${firstType}-gradient-2 to-${firstType}-gradient"
                                                    data-width="${displayHp}" style="width: 0;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 w-full">
                                            <p class="mr-9 w-12 text-right">${attack}</p>
                                            <div class="bg-gray-100 dark:bg-[#434C5B] h-2.5 w-full relative rounded-md">
                                                <div class="fill-bar h-full rounded-md bg-gradient-to-r from-${firstType}-gradient-2 to-${firstType}-gradient"
                                                    data-width="${displayAttack}" style="width: 0;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 w-full">
                                            <p class="mr-9 w-12 text-right">${defense}</p>
                                            <div class="bg-gray-100 dark:bg-[#434C5B] h-2.5 w-full relative rounded-md">
                                                <div class="fill-bar h-full rounded-md bg-gradient-to-r from-${firstType}-gradient-2 to-${firstType}-gradient"
                                                    data-width="${displayDefense}" style="width: 0;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 w-full">
                                            <p class="mr-9 w-12 text-right">${spAtk}</p>
                                            <div class="bg-gray-100 dark:bg-[#434C5B] h-2.5 w-full relative rounded-md">
                                                <div class="fill-bar h-full rounded-md bg-gradient-to-r from-${firstType}-gradient-2 to-${firstType}-gradient"
                                                    data-width="${displaySpAttack}" style="width: 0;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 w-full">
                                            <p class="mr-9 w-12 text-right">${spDef}</p>
                                            <div class="bg-gray-100 dark:bg-[#434C5B] h-2.5 w-full relative rounded-md">
                                                <div class="fill-bar h-full rounded-md bg-gradient-to-r from-${firstType}-gradient-2 to-${firstType}-gradient"
                                                    data-width="${displaySpDefense}" style="width: 0;">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 w-full">
                                            <p class="mr-9 w-12 text-right">${speed}</p>
                                            <div class="bg-gray-100 dark:bg-[#434C5B] h-2.5 w-full relative rounded-md">
                                                <div class="fill-bar h-full rounded-md bg-gradient-to-r from-${firstType}-gradient-2 to-${firstType}-gradient"
                                                    data-width="${displaySpeed}" style="width: 0;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                        
                            requestAnimationFrame(() => {
                                const fillBars = document.querySelectorAll(".fill-bar");
                                fillBars.forEach(bar => {
                                    const targetValue = parseInt(bar.getAttribute("data-width"), 10);
                                    bar.style.width = targetValue + "%";
                                });
                            });
                        
                        break;
    
                case 'evolutionBtn':
                        setActiveButton($evolutionBtn);
                    
                        const evolutionChain = currentCardData.evolutionDetails; 
                    
                        function getStageLabel(index) {
                            if (index === 0) return "Unevolved";
                            if (index === 1) return "1st evolution";
                            if (index === 2) return "2nd evolution";
                            if (index === 3) return "3rd evolution";
                            return `${index}th evolution`;
                        }
                    
                        const arrowSVG = `
                            <div class="sm:flex items-center flex-shrink-0 hidden">
                                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.47705 5.10327C0.924766 5.10327 0.477051 5.55099 0.477051 6.10327C0.477051 6.65556 0.924766 7.10327 1.47705 7.10327V5.10327ZM23.1026 6.10327L17.3291 0.329769L11.5556 6.10327L17.3291 11.8768L23.1026 6.10327ZM1.47705 7.10327H17.3291V5.10327H1.47705V7.10327Z" fill="#C0C0C0"/>
                                </svg>
                            </div>
                        `;
                    
                        function capitalize(str) {
                            return str.charAt(0).toUpperCase() + str.slice(1);
                        }
                    
                        // Make the name clickable and styled
                        function formatName(name) {
                            const capName = capitalize(name);
                            return `<span class="font-bold text-${firstType} dark:text-${firstType}2 no-underline hover:underline cursor-pointer pokemon-link" data-pokemon="${capName}">${capName}</span>`;
                        }
                    
                        let evoInfoHTML = '';
                    
                        if (!evolutionChain || evolutionChain.length <= 1) {
                            evoInfoHTML = `
                                <div class="flex flex-col sm:text-lg text-gray-700 dark:text-white">
                                    <h4 class="font-bold">Transformation</h4>
                                    <p class="text-gray-500 dark:text-gray-300 text-2xs sm:text-sm font-medium">
                                        ${evolutionChain && evolutionChain[0] 
                                            ? `${capitalize(evolutionChain[0].name)} does not evolve.`
                                            : 'No evolutions available.'
                                        }
                                    </p>
                                </div>`;
                        } else {
                            const names = evolutionChain.map(stage => stage.name);
                            let sentence = formatName(names[0]);
                            for (let i = 1; i < names.length; i++) {
                                if (i === 1) {
                                    sentence += ` evolves into ${formatName(names[i])}`;
                                } else {
                                    sentence += `, which evolves into ${formatName(names[i])}`;
                                }
                            }
                            sentence += ".";
                    
                            evoInfoHTML = `
                                <div class="flex flex-col sm:text-lg text-gray-700 dark:text-white">
                                    <h4 class="font-bold">Transformation</h4>
                                    <p class="text-gray-500 dark:text-gray-300 text-xs sm:text-sm font-medium pt-2">
                                        ${sentence}
                                    </p>
                                </div>`;
                        }
                    
                        let evoHTML = `
                            <div class="max-w-[85%] mx-auto pt-8 pb-4 tall:pt-10 tallxl:pt-14">
                                <div class="flex-col flex max-w-full items-start">
                                    ${evoInfoHTML}
                                    <!-- Evolution chain -->
                                    <div class="flex items-center gap-4 justify-between max-w-full">
                        `;
                    
                        if (evolutionChain && Array.isArray(evolutionChain)) {
                            evolutionChain.forEach((stage, i) => {
                                evoHTML += `
                                    <div class="flex flex-col items-center text-center justify-between flex-grow pt-7 sm:pt-[48px]">
                                        <div class="flex flex-col items-center">
                                            <div class="rounded-xl tall:rounded-[33px] border border-gray-300 bg-gray-100 dark:bg-[#434D5C] dark:border-gray-500 p-2 md:p-4 flex justify-center items-center">
                                                <img class="object-contain w-full max-w-[80px] md:max-w-[120px] lg:max-w-[140px]" src="${stage.sprite}" alt="${stage.name}">
                                            </div>
                                            <h5 class="font-bold text-sm sm:text-lg pt-2 dark:text-white text-gray-700">${capitalize(stage.name)}</h5>
                                            <p class="font-semibold text-xs sm:text-sm opacity-60 dark:text-white dark:opacity-50">${getStageLabel(i)}</p>
                                        </div>
                                    </div>
                                `;
                                if (i < evolutionChain.length - 1) {
                                    evoHTML += arrowSVG;
                                }
                            });
                        } else {
                            evoHTML += `
                                <div class="pt-8 text-center text-gray-500 dark:text-gray-300">No evolutions available.</div>
                            `;
                        }
                    
                        evoHTML += `
                                    </div>
                                </div>
                            </div>
                        `;
                    
                        $baseStats.innerHTML = evoHTML;
                    
                        document.querySelectorAll('.pokemon-link').forEach(link => {
                            link.addEventListener('click', () => {
                                const clickedName = link.dataset.pokemon.toLowerCase();
                                toggleModal(); // Close the current modal
                        
                                setTimeout(() => {
                                    const foundCurrentCardData = allPokemon.find(poke => poke.name.toLowerCase() === clickedName);
                        
                                    if (foundCurrentCardData) {
                                        // Try finding the card
                                        let card = document.querySelector(`.pokemon-card[data-name="${clickedName}"]`);
                                        if (!card) {
                                            // Card not on page, so we open the modal from data directly
                                            openModal(foundCurrentCardData);
                                        } else {
                                            // Card exists, open normally
                                            openModal(card);
                                        }
                                    } else {
                                        console.error("Pokémon not found in the global store:", clickedName);
                                    }
                                }, 300);
                            });
                        });
                    
                        break;
    
                case 'movesBtn':
                    setActiveButton($movesBtn);
                
                    // Check if moves data exists
                    const moves = currentCardData.moves || [];
                    console.log(currentCardData.moves);
                
                    const moveRows = moves.map(move => {
                        const { name, damageClass, accuracy } = move;
                    
                        // Transform the move name: split on hyphen, capitalize each word, and join with spaces.
                        const displayName = name
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                    
                        // Capitalize first letter of damageClass
                        const displayDamageClass = damageClass.charAt(0).toUpperCase() + damageClass.slice(1);
                    
                        return `
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg">
                                <td class="py-1.5 px-3 text-left rounded-l-lg">${displayName}</td>
                                <td class="py-1.5 px-3 text-left">${displayDamageClass}</td>
                                <td class="py-1.5 px-3 text-right rounded-r-lg">${accuracy || '—'}</td>
                            </tr>
                        `;
                    }).join('');
                
                    $baseStats.innerHTML = `
                        <div class="max-w-[85%] mx-auto pt-6 pb-6 tallxl:pt-14">
                            <div class="flex-col flex gap-6 max-w-full items-start">
                                <!-- Moves Table -->
                                <div class="w-full">
                                    <table class="w-full text-center text-sm md:text-base rounded-lg overflow-hidden">
                                        <thead class="text-gray-700 dark:text-gray-100 font-bold">
                                            <tr>
                                                <th class="py-1.5 px-3 text-left">Move</th>
                                                <th class="py-1.5 px-3 text-left">Type</th>
                                                <th class="py-1.5 px-3 text-right">Accuracy</th>
                                            </tr>
                                        </thead>
                                        <tbody class="text-gray-500 dark:text-gray-300 font-semibold text-2xs leading-3 sm:leading-normal sm:text-xs">
                                            ${moveRows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    `;
                
                    break;
            }
        }
    });
    
    function setVh() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
      window.addEventListener('resize', setVh);
      setVh();
    


    /***************************************************** 
                        Favourites
    ******************************************************/

    function getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }
    
    let isFavoritesPageActive = false;

    function loadFavoritesPage() {
        const $pokemonList = document.getElementById('pokemonList');
        if (!$pokemonList) return;

        $pokemonList.innerHTML = '';
        const favorites = getFavorites();

        if (favorites.length === 0) {
            $pokemonList.innerHTML = '<p class="text-center dark:text-white">No favorite Pokémon found.</p>';
            isFavoritesPageActive = true; // Favorites page is open, even if empty
            $pokedexName.textContent = ("My Pokémon");
            $filterBtn.classList.add("hidden");
            $loadMoreBtn.classList.add("hidden");
            $backToPokedex.classList.remove("hidden");
            return;
        }

        $pokedexName.textContent = ("My Pokémon");
        $filterBtn.classList.add("hidden");
        $loadMoreBtn.classList.add("hidden");
        $backToPokedex.classList.remove("hidden");

        // Use the favorites-specific populate function
        populateFavoritesCards(favorites);

        // Indicate we are now on the favorites page
        isFavoritesPageActive = true;
    }

    function updateFavoriteCount() {
        const favorites = getFavorites();
        const count = favorites.length;
    
        const faveCountElement = document.getElementById('faveCount');
        const badgeCircles = document.querySelectorAll('.fave-badge-circle');
    
        // If elements not found, do nothing
        if (!faveCountElement || badgeCircles.length === 0) return;
    
        if (count > 0) {
            // Show the count and circles
            faveCountElement.textContent = count;
            faveCountElement.classList.remove('hidden');
    
            badgeCircles.forEach(circle => {
                circle.classList.remove('hidden');
            });
        } else {
            // Hide the count and circles
            faveCountElement.classList.add('hidden');
    
            badgeCircles.forEach(circle => {
                circle.classList.add('hidden');
            });
        }
    }

    updateFavoriteCount();


    function backToPokedex() {
        isFavoritesPageActive = false;
        // Clear the current cards
        $pokemonList.innerHTML = '';
        // Now populate with the main Pokémon list
        populatePokemonCards(displayedPokemon);
        $pokedexName.textContent = "Pokédex";
        $filterBtn.classList.remove("hidden");
        $loadMoreBtn.classList.remove("hidden");
        $backToPokedex.classList.add("hidden");
    }

    if ($backToPokedexBtn) {
        $backToPokedexBtn.addEventListener('click', backToPokedex);
    };
    

    async function populateFavoritesCards(favoritesList) {
        const $pokemonList = document.getElementById('pokemonList');
        if (!$pokemonList) return;
    
        // Clear out any existing content
        $pokemonList.innerHTML = '';
    
        // Create an array to store all the generated card HTML
        const cards = [];
    
        favoritesList.forEach((pokemon) => {
            // Resolve primary type
            const primaryType = pokemon.types[0] || "normal";
            const validTypes = [
                "grass", "fire", "water", "bug", "normal", "poison", "electric",
                "ground", "fairy", "fighting", "psychic", "rock", "dragon",
                "ice", "steel", "ghost", "dark", "flying"
            ];
            const resolvedType = validTypes.includes(primaryType) ? primaryType : "normal";
    
            const pokemonTypes = pokemon.types.map((type) => `
                <p class="bg-white text-white font-bold text-xs 3sm:text-sm bg-opacity-[15%] rounded-full px-2 3sm:px-4 py-0.5">
                    ${type}
                </p>
            `).join("");
    
            const formattedId = formatPokeId(pokemon.id);
            const displayName = formatPokemonName(pokemon.name);
            const nameClass = displayName.length > 9 ? 'text-base 3sm:text-lg' : 'text-lg 3sm:text-xl';
    
            // Check device dimensions for special layout
            const isSpecialDevice = (
                (window.innerWidth === 344 && window.innerHeight === 882) ||
                (window.innerWidth === 882 && window.innerHeight === 344) ||
                (window.innerWidth === 375 && window.innerHeight === 667) ||
                (window.innerWidth === 667 && window.innerHeight === 375) ||
                (window.innerWidth === 820 && window.innerHeight === 1180) ||
                (window.innerWidth === 1180 && window.innerHeight === 820)
            );
    
            const cardImage = pokemon.cardImage; 
    
            let cardHTML;
            if (displayName.length > 10 || isSpecialDevice) {
                cardHTML = `
                    <div class="pokemon-card bg-${resolvedType} relative flex pokemonColor flex-col justify-between w-62 rounded-[24px] px-4 pt-6 3.5xs:pt-4 pb-4 overflow-hidden hover:cursor-pointer transform border-2 border-transparent hover:border-black/20 dark:hover:border-white/60 dark:hover:border-opacity-60 transition-all duration-300 ease-in-out shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.4), inset_0_0_0_2px_rgba(128,128,128,1)] group"
                        data-id="${pokemon.id}"
                        data-name="${pokemon.name}"
                        data-types='${JSON.stringify(pokemon.types)}'
                        data-height="${pokemon.height}"
                        data-weight="${pokemon.weight}"
                        data-abilities='${JSON.stringify(pokemon.abilities)}'
                        data-sprites="${cardImage}"
                        data-base-stats='${JSON.stringify(pokemon.baseStats)}'
                        data-species='${pokemon.species}'
                    >
                        <div class="relative w-full">
                            <p id="pokemonNumber" role="text" aria-label="Pokémon Number"
                                class="opacity-15 font-extrabold text-sm 2sx:text-base absolute top-0 right-0">
                                ${formattedId}
                            </p>
                            <h2 id="pokemonName"
                                class="text-white font-bold ${nameClass} mt-6 mb-1">
                                ${displayName}
                            </h2>
                        </div>
                        <div class="flex 3.5xs:justify-between justify-start">
                            <div class="flex flex-col gap-2 mt-6">
                                ${pokemonTypes}
                            </div>
                            <div class="relative flex items-center">
                                <div class="absolute opacity-25 -bottom-10">
                                    <!-- Poké Ball SVG -->
                                    <svg width="130" height="133" viewBox="0 0 108 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M54.0143 71.014C62.5766 71.014 69.5178 63.9383 69.5178 55.2099C69.5178 46.4815 62.5766 39.4058 54.0143 39.4058C45.4519 39.4058 38.5108 46.4815 38.5108 55.2099C38.5108 63.9383 45.4519 71.014 54.0143 71.014Z" fill="white"/>
                                        <path d="M85.6032 61.5866C84.8967 61.5866 84.2776 62.0783 84.1105 62.779C80.7835 76.5776 68.5729 86.8066 54.0113 86.8066C39.4497 86.8066 27.2353 76.5738 23.9083 62.779C23.7412 62.0783 23.1221 61.5866 22.4157 61.5866H1.97097C1.02906 61.5866 0.303639 62.4383 0.440367 63.3869C4.31814 89.9968 26.8213 110.416 54.0113 110.416C81.2013 110.416 103.701 89.9968 107.578 63.3869C107.715 62.4383 106.99 61.5866 106.048 61.5866H85.6032ZM54.0113 0C26.8251 0 4.32193 20.4192 0.440367 47.0291C0.303639 47.9777 1.02906 48.8294 1.97097 48.8294H22.4119C23.1183 48.8294 23.7374 48.3377 23.9045 47.637C27.2315 33.8422 39.4459 23.6094 54.0113 23.6094C68.5767 23.6094 80.7873 33.8461 84.1143 47.637C84.2814 48.3377 84.9005 48.8294 85.607 48.8294H106.048C106.99 48.8294 107.715 47.9777 107.578 47.0291C103.701 20.4192 81.1937 0 54.0113 0Z" fill="white"/>
                                    </svg>
                                </div>
                                <img id="pokemonImg" src="${cardImage}" alt="${pokemon.name}" class="relative max-h-24 max-w-24 right-0 3sm:max-h-24 3sm:max-w-24 3sm:-right-2 group-hover:scale-105 transition-transform duration-200 ease-in-out">
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Regular layout
                cardHTML = `
                    <div class="pokemon-card bg-${resolvedType} relative flex pokemonColor flex-col justify-between w-62 rounded-[24px] px-4 pt-6 3.5xs:pt-4 pb-2 overflow-hidden hover:cursor-pointer transform border-2 border-transparent hover:border-black/20 dark:hover:border-white/60 dark:hover:border-opacity-60 transition-all duration-300 ease-in-out shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.4), inset_0_0_0_2px_rgba(128,128,128,1)] group"
                        data-id="${pokemon.id}"
                        data-name="${pokemon.name}"
                        data-types='${JSON.stringify(pokemon.types)}'
                        data-height="${pokemon.height}"
                        data-weight="${pokemon.weight}"
                        data-abilities='${JSON.stringify(pokemon.abilities)}'
                        data-sprites="${cardImage}"
                        data-base-stats='${JSON.stringify(pokemon.baseStats)}'
                        data-species='${pokemon.species}'
                    >
                        <div class="relative w-full">
                            <p id="pokemonNumber" role="text" aria-label="Pokémon Number"
                                class="opacity-15 font-extrabold text-sm 2sx:text-base absolute top-0 right-0">
                                ${formattedId}
                            </p>
                            <h2 id="pokemonName"
                                class="text-white font-bold ${nameClass} mt-2 mb-1">
                                ${displayName}
                            </h2>
                        </div>
                        <div class="flex 3.5xs:justify-between justify-start">
                            <div class="flex flex-col gap-2 mt-6">
                                ${pokemonTypes}
                            </div>
                            <div class="relative flex items-center">
                                <div class="absolute opacity-25 -bottom-10">
                                    <!-- Poké Ball SVG -->
                                    <svg width="130" height="133" viewBox="0 0 108 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M54.0143 71.014C62.5766 71.014 69.5178 63.9383 69.5178 55.2099C69.5178 46.4815 62.5766 39.4058 54.0143 39.4058C45.4519 39.4058 38.5108 46.4815 38.5108 55.2099C38.5108 63.9383 45.4519 71.014 54.0143 71.014Z" fill="white"/>
                                        <path d="M85.6032 61.5866C84.8967 61.5866 84.2776 62.0783 84.1105 62.779C80.7835 76.5776 68.5729 86.8066 54.0113 86.8066C39.4497 86.8066 27.2353 76.5738 23.9083 62.779C23.7412 62.0783 23.1221 61.5866 22.4157 61.5866H1.97097C1.02906 61.5866 0.303639 62.4383 0.440367 63.3869C4.31814 89.9968 26.8213 110.416 54.0113 110.416C81.2013 110.416 103.701 89.9968 107.578 63.3869C107.715 62.4383 106.99 61.5866 106.048 61.5866H85.6032ZM54.0113 0C26.8251 0 4.32193 20.4192 0.440367 47.0291C0.303639 47.9777 1.02906 48.8294 1.97097 48.8294H22.4119C23.1183 48.8294 23.7374 48.3377 23.9045 47.637C27.2315 33.8422 39.4459 23.6094 54.0113 23.6094C68.5767 23.6094 80.7873 33.8461 84.1143 47.637C84.2814 48.3377 84.9005 48.8294 85.607 48.8294H106.048C106.99 48.8294 107.715 47.9777 107.578 47.0291C103.701 20.4192 81.1937 0 54.0113 0Z" fill="white"/>
                                    </svg>
                                </div>
                                <img id="pokemonImg" src="${cardImage}" alt="${pokemon.name}" class="relative max-h-24 max-w-24 right-0 3sm:max-h-24 3sm:max-w-24 3sm:-right-2 group-hover:scale-105 transition-transform duration-200 ease-in-out">
                            </div>
                        </div>
                    </div>
                `;
            }
    
            cards.push(cardHTML);
        });
    
        const fullHTML = cards.join("");
    
        // Preload images before appending to the DOM
        const imagePromises = favoritesList.map(pokemon => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = pokemon.cardImage; // Ensure favorites store cardImage property
                img.onload = () => resolve();
                img.onerror = () => resolve(); 
            });
        });
    
        await Promise.all(imagePromises);
    
        // Once all images are loaded, append to the DOM
        $pokemonList.innerHTML += fullHTML;
    }


});