//-------------------------------------------------FETCH API
async function chargerArticles(){ //Fetch API
    try{
        const req = await fetch('http://localhost:3000/api/products/'); 
        if(!req.ok){
            throw new Error("Error HTTP : ", req.status);
        }
        const datas = await req.json();

        //insersions fonctions nécessistant les datas
        showCart(datas)

    }catch(e){
        console.error("Error : ", e)
    }
}

chargerArticles() //Appel du fetch

//------------------------------------------------------CONSTANTES

const buyBtn = document.querySelector('#buy-btn');
const cartContainer = document.querySelector('#panier');
const totalCommande = document.querySelector('#resume-commande')

const cartItems = []; // Panier
let supprButtons
let totalPrice = 0 // prix total

// ----------------------------------------------------FONCTION PRINCIPALE

const showCart = (data) => { //Affichage panier
    //Réinitialisation visuelle
    cartItems.length = 0; 
    cartContainer.innerHTML = "";

    // Boucle pour chaque élement du localStorage
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i); 
        const storage = JSON.parse(localStorage.getItem(key))
        cartItems.push(storage);
        console.log(storage)

        //affichage HTML
        cartContainer.innerHTML += `
            <article class="article-article" data-key="${key}">
                <img src="${storage.image}" alt="">
                <h3>${storage.title}</h3>
                <p>Format : ${storage.format}</p>
                <p id="prix-${i}"></p>
                <p>Quantité : <span>${storage.quantity}</span></p>
                <p class="suppr">Supprimer</p>
            </article>
        `
    };

    //Appel des fonctions annexes

    showPrice(data, cartItems); //Appel de la fonction d'affichage des prix

    supprButtons = document.querySelectorAll(`.suppr`); //Création boutton de suppression
    deleteArticle(data); //Appel fonction bouton supprimer

    showTotal()//Appel affichage montant total
};

//---------------------------------------------------FONCTIONS ANNEXES

// BOUTON SUPPRIMER
const deleteArticle = (data, ) => { 
    supprButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        cartContainer.innerHTML = ""
        const article = btn.closest('.article-article');
        const key = article.dataset.key; // récupère la clé unique
        localStorage.removeItem(key); //supression de l'article
        showCart(data); // recharge le panier
    });
  });
}

//AFFICHAGE TOTAL
const showTotal = () =>{ // Affichage du total
    totalCommande.innerText = `X articles pour un montant de ${parseInt(totalPrice).toFixed(2)} €`
}

// AFFICHAGE DES PRIX
const showPrice = (dataFromAPI, cartItems) => { //Affichage des prix
    totalPrice = 0

    cartItems.forEach((item, index) => {
        const match = dataFromAPI.find(el => el._id === item.id); //match id ?

        if(match){
            const matchSize = match.declinaisons.find(el => el.taille === item.format); //match format ?

            if(matchSize){
                const price = matchSize.prix * item.quantity; // multiplication en fonction de la quantité

                const priceElement = document.querySelector(`#prix-${index}`); //Sélection dynamique du price slot
                if(priceElement){
                    priceElement.innerText = `${price} €`; //Affichage
                    totalPrice += price
                    console.log(totalPrice)
                }
            }
        }
    })
}

//PRUCHASE BTN
buyBtn.addEventListener('click', () => {
    localStorage.clear(); //Delete localStorage
})
