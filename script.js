// Conteneurs
const recipeContainer = document.getElementById("recipe-cards");
const searchInput = document.getElementById("search-input");

//Selects
const ingredientsSelect = document.getElementById('list-ingredients')
const appliancesSelect = document.getElementById("list-appareils");
const utensilsSelect = document.getElementById("tools");
const tagsContainer = document.getElementById("tags-container");

//Variables pour suivre les filtres
const activeFilters = {
    ingredient: [],
    appareil: [],
    ustensile: [],
};

// Initialiser les selects
function populateSelects() {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach((recipe) => {
        // Ajouter les ingrédients
        recipe.ingredients.forEach((item) => ingredients.add(item.ingredient));

        // Ajouter les appareils
        appliances.add(recipe.appliance);

        // Ajouter les ustensiles
        recipe.ustensils.forEach((item) => utensils.add(item));
    });

    // Ajouter les options aux selects
    addOptionsToSelect(ingredientsSelect, Array.from(ingredients));
    addOptionsToSelect(appliancesSelect, Array.from(appliances));
    addOptionsToSelect(utensilsSelect, Array.from(utensils));
}

// Ajouter des options à un select
function addOptionsToSelect(select, options) {
    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

// Fonction pour afficher les recettes
function displayRecipes(recipes) {
    // Réinitialise le conteneur
    recipeContainer.innerHTML = "";

    // Parcourt chaque recette et crée une carte
    recipes.forEach((recipe) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.setAttribute("data-id", recipe.id); // Identifiant unique

        // Construire les ingrédients sous forme de liste
        const ingredientGrid = recipe.ingredients
            .map((item) => {
                const quantity = item.quantity ? `${item.quantity}` : "";
                const unit = item.unit ? `${item.unit}` : "";
                return `
                    <div class="ingredient-item">
                        <span class="ingredient-name">${item.ingredient}</span>
                        <span class="ingredient-quantity">${quantity} ${unit}</span>
                    </div>
                `;
            })
            .join("");

        // Contenu HTML de la carte
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <p class="time">${recipe.time} min</p>
            <div class="recipe-body">
                <h2 class="recipe-name">${recipe.name}</h2>
                <div class="recipe">
                    <div class="recipe-content">
                        <h3>Recette</h3>
                        <p class="recipe-description">${recipe.description.replace(/\n/g, "<br>")}</p>
                    </div>
                    <div class="recipe-ingredients">
                        <h3>Ingrédients</h3>
                        <div class="ingredient-grid">${ingredientGrid}</div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter la carte au conteneur
        recipeContainer.appendChild(card);
    });
}

// Fonction pour filtrer les recettes
function filterRecipes(query) {
    const recipeCards = document.querySelectorAll(".recipe-card");
    query = query.toLowerCase(); // Normalise la recherche en minuscules

    recipeCards.forEach((card) => {
        // Récupérer le texte visible dans la carte pour le filtrage
        const recipeName = card.querySelector(".recipe-name").textContent.toLowerCase();

        // Vérifie si le texte contient la recherche
        if (recipeName.includes(query)) {
            card.style.display = ""; // Affiche la carte
        } else {
            card.style.display = "none"; // Cache la carte
        }
    });
}

// Écouteur d'événement pour le champ de recherche
searchInput.addEventListener("input", (event) => {
    const query = event.target.value; // Récupère la valeur saisie
    filterRecipes(query); // Filtre les cartes en fonction de la recherche
});

// Créer un tag
function createTag(type, value) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.setAttribute("data-type", type);
    tag.setAttribute("data-value", value);

    tag.innerHTML = `
        ${value} <span class="remove-tag">&times;</span>
    `;

    // Ajouter un gestionnaire pour supprimer le tag
    tag.querySelector(".remove-tag").addEventListener("click", () => {
        tag.remove();
        activeFilters[type] = activeFilters[type].filter((item) => item !== value);
        applyFilters();
    });

    tagsContainer.appendChild(tag);
}

// Gérer la sélection d'un mot-clé
function handleSelectChange(event, type) {
    const selectedValue = event.target.value;

    if (selectedValue) {
        if (!activeFilters[type].includes(selectedValue)) {
            activeFilters[type].push(selectedValue);
            createTag(type, selectedValue);
            applyFilters();
        }

        event.target.value = "";
    }
}

// Appliquer les filtres
function applyFilters() {
    let filteredRecipes = recipes;

    if (activeFilters.ingredient.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
            activeFilters.ingredient.every((ingredient) =>
                recipe.ingredients.some(
                    (item) => item.ingredient.toLowerCase() === ingredient.toLowerCase()
                )
            )
        );
    }

    if (activeFilters.appareil.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
            activeFilters.appareil.includes(recipe.appliance.toLowerCase())
        );
    }

    if (activeFilters.ustensile.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
            activeFilters.ustensile.every((ustensile) =>
                recipe.utensils.some(
                    (item) => item.toLowerCase() === ustensile.toLowerCase()
                )
            )
        );
    }

    displayRecipes(filteredRecipes);
}

// Ajouter des écouteurs aux selects
ingredientsSelect.addEventListener("change", (e) => handleSelectChange(e, "ingredient"));
appliancesSelect.addEventListener("change", (e) => handleSelectChange(e, "appareil"));
utensilsSelect.addEventListener("change", (e) => handleSelectChange(e, "ustensile"));

// Initialise
populateSelects();
displayRecipes(recipes);