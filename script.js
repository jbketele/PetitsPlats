//Le conteneur pour afficher les cartes
const recipeContainer = document.getElementById("recipe-container");

//Boucle pour afficher les recettes
recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    //Contenu HTML de la carte
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
        <div class="recipe-content">
            <h2 class="recipe-name">${recipe.name}</h2>
            <p class="recipe-description">${recipe.description}</p>
            <p class="recipe-time">Temps de cuisson : ${recipe.time}</p>
        </div>
    `;

    //Ajouter la carte au conteneur
    recipeContainer.appendChild(card);
})