let apiData = [];

//-------------------------------------------------FETCH API
async function chargerArticles(){ //Fetch API
    try{
        const req = await fetch('http://localhost:3000/api/products/'); 
        if(!req.ok){
            throw new Error("Error HTTP : ", req.status);
        }
        const datas = await req.json();
        apiData = datas;
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
const totalCommande = document.querySelector('#resume-commande');

const cartItems = []; // Panier
let supprButtons;
let totalPrice = 0; // prix total
let totalQte = 0; // quantité d'article total

// ----------------------------------------------------FONCTION PRINCIPALE

const showCart = (data) => { //Affichage panier
    //Réinitialisation visuelle
    cartItems.length = 0; 
    cartContainer.innerHTML = "";

    if(localStorage.length === 0){ // si aucun article dans le panier
        cartContainer.innerHTML = "<p id='empty-cart'>Vous n'avez aucun article dans votre panier :(</p>";
        return 
    }

    // Boucle pour chaque élement du localStorage
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i); 
        const storage = JSON.parse(localStorage.getItem(key));
        cartItems.push(storage);
        console.log(storage);

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
const deleteArticle = (data) => { 
    supprButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const article = btn.closest('.article-article'); //article le plus proche depuis le btn
        const key = article.dataset.key; // récupère la clé unique
        localStorage.removeItem(key); //supression de l'article
        showCart(data); // recharge le panier
    });
  });
}

// AFFICHAGE DES PRIX
const showPrice = (dataFromAPI, cartItems) => { //Affichage des prix
    totalPrice = 0;
    totalQte = 0;

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
                    totalQte += item.quantity
                    console.log(totalPrice)
                }
            }
        }
    })
}

//AFFICHAGE TOTAL
const showTotal = () =>{ // Affichage du total
    totalCommande.innerText = `${totalQte} articles pour un montant de ${totalPrice.toFixed(2)} €`
}

//PRUCHASE BTN
buyBtn.addEventListener('click', (e) => {
    e.preventDefault()

    if(localStorage.length === 0){
        alert("Vous ne pouvez pas passer commande sans article dans votre panier :(");
        return
    }

    const loopArray = [
        {
            label : "prémon",
            input : document.querySelector('#name-input'),
            msg : document.querySelector('#name-return'),
            min : 2,
            regex : /^[A-Za-zÀ-ÿ\- ]+$/
        },
        {
            label : "nom",
            input : document.querySelector('#surname-input'),
            msg : document.querySelector('#surname-return'),
            min : 2,
            regex : /^[A-Za-zÀ-ÿ\- ]+$/
        },
        {
            label : "adresse",
            input : document.querySelector('#address-input'),
            msg : document.querySelector('#address-return'),
            min : 10,
            regex : ""
        },
        {
            label : "email",
            input : document.querySelector('#email-input'),
            msg : document.querySelector('#email-return'),
            min : 5,
            regex : /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        {
            label : "ville",
            input : document.querySelector('#city-input'),
            msg : document.querySelector('#city-return'),
            min : 3,
            regex : ""
        },
    ]

    let isError = false

    for(const el of loopArray){ //Boucle de vérification pour chaque input
        inputValue = el.input.value.trim();

        if(inputValue.length <= el.min){
            el.msg.innerText  = `Votre ${el.label} doit faire plus de ${el.min} lettres :(`
            isError = true
        }

        if(el.regex !== "" && !el.regex.test(inputValue)){
            el.msg.innerText  = `Votre ${el.label} contient des caractères invalides :(`
            isError = true
        }
    }
    
    if(isError){
        return
    }

    //Modal de confirmation de commande
    const dialog = document.querySelector("#confirmation-modal");
    const closeModal = document.querySelector("#close-modal");

    dialog.showModal();

    closeModal.addEventListener('click', () => {
        dialog.close();
    })

    //Delete localStorage + visu
    localStorage.clear(); 
    cartItems.length = 0;
    cartContainer.innerHTML = "";
    totalCommande.innerText = ""
    showCart(apiData)
})
