//Le conteneur pour afficher les cartes
const recipeContainer = document.getElementById("recipe-cards");

//Boucle pour afficher les recettes
recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    // Construire les ingrédients sous forme de liste avec les quantités en dessous
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


    //Contenu HTML de la carte
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
        <p class= "time">${recipe.time}min</p>
        <div class="recipe-body">
            <h2 class="recipe-name">${recipe.name}</h2>
            <div class="recipe">
                <div class="recipe-content">
                    <h3>recette</h3>
                    <p class="recipe-description">${recipe.description.replace(/\n/g, "<br>")}</p>
                </div>
                <div class="recipe-ingredients">
                    <h3>ingrédients</h3>
                    <div class= "ingredient-grid">${ingredientGrid}</div>
                </div>
            </div>
        </div>
    `;

    //Ajouter la carte au conteneur
    recipeContainer.appendChild(card);
})