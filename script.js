// Sélection des éléments DOM
const recipeContainer = document.getElementById("recipe-cards");
const searchInput = document.getElementById("search-input");

// Fonction pour afficher les recettes
function displayRecipes(recipes) {
    // Réinitialiser le conteneur
    recipeContainer.innerHTML = "";

    // Parcourir le tableau avec une boucle native
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.setAttribute("data-id", recipe.id); // Identifiant unique

        // Construire les ingrédients sous forme de liste
        let ingredientGrid = "";
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const item = recipe.ingredients[j];
            const quantity = item.quantity ? `${item.quantity}` : "";
            const unit = item.unit ? `${item.unit}` : "";
            ingredientGrid += `
                <div class="ingredient-item">
                    <span class="ingredient-name">${item.ingredient}</span>
                    <span class="ingredient-quantity">${quantity} ${unit}</span>
                </div>
            `;
        }

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
    }
}

// Fonction pour filtrer les recettes
function filterRecipes(query) {
    const recipeCards = document.querySelectorAll(".recipe-card");
    query = query.toLowerCase(); // Normaliser la recherche

    // Parcourir les cartes avec une boucle native
    for (let i = 0; i < recipeCards.length; i++) {
        const card = recipeCards[i];
        const recipeName = card.querySelector(".recipe-name").textContent.toLowerCase();

        // Vérifier si le nom contient le texte recherché
        if (recipeName.includes(query)) {
            card.style.display = ""; // Affiche la carte
        } else {
            card.style.display = "none"; // Cache la carte
        }
    }
}

// Écouteur d'événement pour le champ de recherche
searchInput.addEventListener("input", function (event) {
    const query = event.target.value; // Récupérer la valeur saisie
    filterRecipes(query); // Appliquer le filtre
});

// Affiche toutes les recettes au chargement
displayRecipes(recipes);