// Initialisation des variables principales
const recipeContainer = document.getElementById("recipe-cards");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");  // Loupe pour recherche stricte
const tagsContainer = document.getElementById("tags-container");

const activeFilters = {
    ingredient: [],
    appliance: [],
    ustensil: []
};

const ingredients = new Set();
const appliances = new Set();
const ustensils = new Set();

//Fonction pour le nombre de recttes
function updateRecipeCount(filteredRecipes) {
    const recipeCountElement = document.getElementById("number-recipes");
    const count = filteredRecipes.length;
    recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
}

// Fonction de recherche globale (partielle)
function searchGlobal() {
    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        const filteredRecipes = [];

        // Boucle sur toutes les recettes
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i]; //recipes vient de recipes.js
            let match = false;

            // Vérifier la correspondance partielle du nom
            if (recipe.name.toLowerCase().includes(query)) {
                match = true;
            }

            // Vérifier la correspondance partielle de la description
            if (!match && recipe.description.toLowerCase().includes(query)) {
                match = true;
            }

            // Vérifier la correspondance partielle des ingrédients
            if (!match) {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    const ingredient = recipe.ingredients[j];
                    if (ingredient.ingredient.toLowerCase().includes(query)) {
                        match = true;
                        break;
                    }
                }
            }

            // Si une correspondance est trouvée, ajouter la recette filtrée
            if (match) {
                filteredRecipes.push(recipe);
            }
        }

        // Vérifier si des recettes ont été trouvées après le filtrage
        if (filteredRecipes.length > 0) {
            applyFilters(filteredRecipes); // Appliquer les filtres si des recettes ont été trouvées
        } else {
            recipeContainer.innerHTML = `<p class="no-results">Aucune recette ne contient "${searchInput.value}".
            Vous pouvez chercher "tartes aux pommes", "poisson", etc.</p>`;
        }
    } else {
        applyFilters(); // Si le champ de recherche est vide, afficher toutes les recettes
    }
}


// Fonction de recherche stricte (exacte)
function searchStrict() {
    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        const filteredRecipes = [];

        // Parcourt toutes les recettes
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let matchFound = false;

            // Vérification stricte du nom
            if (recipe.name.toLowerCase() === query) {
                matchFound = true;
            }

            // Vérification stricte de la description
            if (!matchFound && recipe.description.toLowerCase() === query) {
                matchFound = true;
            }

            // Vérification des ingrédients (comme includes)
            if (!matchFound) {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                    if (ingredient.indexOf(query) !== -1) { // Vérifie si le query est contenu dans l'ingrédient
                        matchFound = true;
                        break; // Pas besoin de continuer à vérifier les autres ingrédients
                    }
                }
            }

            // Si une correspondance a été trouvée, ajoute la recette aux résultats
            if (matchFound) {
                filteredRecipes.push(recipe);
            }
        }

        // Affiche les recettes correspondantes ou un message d'erreur
        if (filteredRecipes.length > 0) {
            displayRecipes(filteredRecipes);
        } else {
            recipeContainer.innerHTML = `<p class="no-results">Aucune recette ne contient "${searchInput.value}".
            Vous pouvez chercher "tartes aux pommes", "poisson", etc.</p>`;
        }
    } else {
        applyFilters(); // Réaffiche toutes les recettes si le champ est vide
    }
}

// Affichage des recettes
function displayRecipes(filteredRecipes) {
    recipeContainer.innerHTML = "";

    filteredRecipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.setAttribute("data-id", recipe.id);

        let ingredientGrid = recipe.ingredients.map(item => `
            <div class="ingredient-item">
                <span class="ingredient-name">${item.ingredient}</span>
                <span class="ingredient-quantity">${item.quantity || ''} ${item.unit || ''}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <p class="time">${recipe.time} min</p>
            <div class="recipe-body">
                <h2 class="recipe-name">${recipe.name}</h2>
                <div class="recipe-content">
                    <h3>Recette</h3>
                    <p class="recipe-description">${recipe.description.replace(/\n/g, "<br>")}</p>
                </div>
                <div class="recipe-ingredients">
                    <h3>Ingrédients</h3>
                    <div class="ingredient-grid">${ingredientGrid}</div>
                </div>
            </div>
        `;
        recipeContainer.appendChild(card);
    });
    updateRecipeCount(filteredRecipes);
}

// Appliquer les filtres actifs
function applyFilters(filteredRecipes = recipes) {
    let resultRecipes = filteredRecipes;

    ['ingredient', 'appliance', 'ustensil'].forEach(filterType => {
        if (activeFilters[filterType].length > 0) {
            resultRecipes = resultRecipes.filter(recipe =>
                activeFilters[filterType].every(value =>
                    filterType === 'ingredient'
                        ? recipe.ingredients.some(item => item.ingredient.toLowerCase() === value.toLowerCase())
                        : filterType === 'appliance'
                            ? recipe.appliance.toLowerCase() === value.toLowerCase()
                            : recipe.ustensils.some(item => item.toLowerCase() === value.toLowerCase())
                )
            );
        }
    });

    displayRecipes(resultRecipes);
    updateRecipeCount(resultRecipes);
}

// Met à jour la liste des options disponibles dans le dropdown en fonction des filtres actifs
function updateDropdownOptions(filterType) {
    const optionsContainer = document.querySelector(`#${filterType}-dropdown .dropdown-options`);
    const options = Array.from(document.querySelectorAll(`#${filterType}-dropdown .dropdown-option`));

    // Réinitialise les options affichées
    optionsContainer.innerHTML = "";

    // Obtenir les recettes actuellement affichées après filtrage
    const filteredRecipes = recipes.filter(recipe => {
        return ['ingredient', 'appliance', 'ustensil'].every(type => {
            return activeFilters[type].every(value =>
                type === 'ingredient'
                    ? recipe.ingredients.some(item => item.ingredient.toLowerCase() === value.toLowerCase())
                    : type === 'appliance'
                        ? recipe.appliance.toLowerCase() === value.toLowerCase()
                        : recipe.ustensils.some(item => item.toLowerCase() === value.toLowerCase())
            );
        });
    });

    // Construire les options disponibles en fonction des recettes filtrées
    const availableOptions = new Set();

    filteredRecipes.forEach(recipe => {
        if (filterType === 'ingredient') {
            recipe.ingredients.forEach(item => availableOptions.add(item.ingredient));
        } else if (filterType === 'appliance') {
            availableOptions.add(recipe.appliance);
        } else if (filterType === 'ustensil') {
            recipe.ustensils.forEach(item => availableOptions.add(item));
        }
    });

    // Afficher uniquement les options qui ne sont pas déjà dans les filtres actifs
    Array.from(availableOptions)
        .filter(option => !activeFilters[filterType].includes(option)) // Exclure les options déjà filtrées
        .forEach(option => {
            const optionDiv = document.createElement("div");
            optionDiv.textContent = option;
            optionDiv.classList.add("dropdown-option");
            optionDiv.addEventListener("click", () => {
                handleSelectChange(filterType, option); // Gestion de la sélection
            });
            optionsContainer.appendChild(optionDiv);
        });
}



// Fonction pour créer un tag original et sa copie
function createTag(type, value) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.setAttribute("data-type", type);
    tag.setAttribute("data-value", value);

    // Générer un identifiant unique pour le tag et sa copie
    const tagId = `tag-${type}-${value}`;
    tag.setAttribute("data-id", tagId);

    // Structure HTML avec l'icône de suppression
    tag.innerHTML = `
        <span class="tag-label">${value}</span>
        <div class="remove-tag">
            <i class="fa-solid fa-circle-xmark"></i>
        </div>
    `;

    // Ajouter le tag dans le conteneur
    let tagContainer = document.querySelector(`#${type}-dropdown .tag-container`);
    if (!tagContainer) {
        const dropdown = document.getElementById(`${type}-dropdown`);
        tagContainer = document.createElement("div");
        tagContainer.classList.add("tag-container");
        dropdown.appendChild(tagContainer);
    }
    tagContainer.appendChild(tag);

    // Créer et associer une copie du tag
    createTagCopy(type, value, tagId);

    // Ajouter l'événement de suppression
    tag.querySelector(".remove-tag").addEventListener("click", () => {
        removeTag(tagId); // Supprimer le tag et sa copie
    });
}

// Fonction pour créer une copie du tag
function createTagCopy(type, value, tagId) {
    const copiedTag = document.createElement("div");
    copiedTag.classList.add("copied-tag");
    copiedTag.setAttribute("data-type", type);
    copiedTag.setAttribute("data-value", value);
    copiedTag.setAttribute("data-id", tagId);

    // Structure HTML avec l'icône de suppression
    copiedTag.innerHTML = `
        <span class="copied-tag-label">${value}</span>
        <span class="remove-tag"><i class="fa-solid fa-lg fa-xmark"></i></span>
    `;

    // Ajouter la copie dans le conteneur
    const tagsContainer = document.getElementById("tags-container");
    if (!tagsContainer) {
        console.warn("Le conteneur '.tags-container' est introuvable.");
        return;
    }
    tagsContainer.appendChild(copiedTag);

    // Ajouter l'événement de suppression
    copiedTag.querySelector(".remove-tag").addEventListener("click", () => {
        removeTag(tagId); // Supprimer la copie et le tag original
    });
}

// Fonction pour supprimer un tag original et sa copie
function removeTag(tagId) {
    // Supprimer le tag original
    const tag = document.querySelector(`.tag[data-id="${tagId}"]`);
    if (tag) tag.remove();

    // Supprimer la copie du tag
    const copiedTag = document.querySelector(`.copied-tag[data-id="${tagId}"]`);
    if (copiedTag) copiedTag.remove();

    // Mettre à jour les filtres actifs
    const [type, value] = tagId.replace("tag-", "").split("-");
    activeFilters[type] = activeFilters[type].filter(item => item !== value);

    // Mettre à jour les options et réappliquer les filtres
    updateDropdownOptions(type);
    applyFilters();
}



// Gestion des sélections
function handleSelectChange(type, value) {
    // On vérifie si le tag existe déjà dans activeFilters
    const existingIndex = activeFilters[type].indexOf(value);

    if (existingIndex !== -1) {
        // Si le mot-clé est déjà dans activeFilters, on le retire
        activeFilters[type].splice(existingIndex, 1);

        // On retire le tag visuellement
        const tag = document.querySelector(`.tag[data-type="${type}"][data-value="${value}"]`);
        if (tag) {
            tag.remove(); // Retirer le tag
        }
    } else {
        // Si le mot-clé n'est pas encore dans activeFilters, on l'ajoute
        activeFilters[type].push(value);
        createTag(type, value); // Créer et afficher le tag
    }

    // Mettre à jour la liste des options dans le dropdown
    updateDropdownOptions(type);

    // Après avoir modifié les filtres, on applique les nouveaux filtres
    applyFilters();
}

// Fonction pour créer une liste déroulante personnalisée
function createCustomDropdown(dropdownId, options, filterType) {
    const dropdown = document.getElementById(dropdownId);
    const header = dropdown.querySelector(".dropdown-header");
    const searchInput = dropdown.querySelector(".dropdown-search");
    const optionsContainer = dropdown.querySelector(".dropdown-options");

    // Afficher/Masquer la liste déroulante
    header.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    });

    // Générer les options
    function renderOptions(filter = "") {
        optionsContainer.innerHTML = ""; // Réinitialiser les options
        options
            .filter(option => option.toLowerCase().includes(filter.toLowerCase()))
            .forEach(option => {
                const optionDiv = document.createElement("div");
                optionDiv.textContent = option;
                optionDiv.classList.add("dropdown-option");
                optionDiv.addEventListener("click", () => {
                    handleSelectChange(filterType, option); // Gestion de la sélection
                });
                optionsContainer.appendChild(optionDiv);
            });
    }

    // Filtrer les options en temps réel
    searchInput.addEventListener("input", () => {
        renderOptions(searchInput.value);
    });

    renderOptions(); // Initialiser les options
}

// Initialisation des dropdowns
function initializeDropdowns(recipes) {
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(item => ingredients.add(item.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(item => ustensils.add(item));
    });

    // Initialiser les dropdowns pour chaque catégorie
    createCustomDropdown("ingredient-dropdown", Array.from(ingredients), "ingredient");
    createCustomDropdown("appliance-dropdown", Array.from(appliances), "appliance");
    createCustomDropdown("ustensil-dropdown", Array.from(ustensils), "ustensil");
}

// Event listener pour surveiller la saisie dans le champ de recherche principal (recherche globale)
searchInput.addEventListener("input", function () {
    if (searchInput.value.length >= 3) {
        searchGlobal(); // Recherche globale si plus de 3 caractères
    } else {
        displayRecipes(recipes); // Afficher toutes les recettes si la recherche est vide
    }
});

// Event listener pour la recherche stricte (lors du clic sur la loupe)
searchButton.addEventListener("click", function () {
    searchStrict(); // Recherche stricte lorsque l'utilisateur clique sur la loupe
});

// Initialisation après le chargement des recettes
initializeDropdowns(recipes);
displayRecipes(recipes); // Afficher les recettes initiales
updateRecipeCount(recipes);
