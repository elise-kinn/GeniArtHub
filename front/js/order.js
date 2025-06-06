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
const totalCommande = document.querySelector('#resume-commande');
const main = document.querySelector('main');

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
    }

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
    //récupération des valeurs des inputs
    const nameInput = document.querySelector('#name-input');
    const surnameInput = document.querySelector('#surname-input');
    const adressInput = document.querySelector('#address-input');
    const emailInput = document.querySelector('#email-input');
    const cityInput = document.querySelector('#city-input');

    //récupération des balises pour messages d'erreurs
    const nameMsg = document.querySelector('#name-return');
    const surnameMsg = document.querySelector('#surname-return');
    const adressMsg = document.querySelector('#address-return');
    const cityMsg = document.querySelector('#city-return');
    const emailMsg = document.querySelector('#email-return');

    const regex = /^[A-Za-zÀ-ÿ\- ]+$/;

    if(localStorage.length === 0){
        alert("Vous ne pouvez pas passer commande sans article dans votre panier :(");
        return
    }

    if(nameInput.value.trim().length <= 2){
        nameMsg.innerText = "Votre prénom doit faire plus de 2 lettres :("
        return
    }else if(!regex.test(nameInput.value.trim())){
        nameMsg.innerText = "Votre prénom ne doit pas contenir de caractères spéciaux :("
        return
    }

    if(surnameInput.value.trim().length <= 2){
        surnameMsg.innerText = "Votre nom doit faire plus de 2 lettres :("
        return
    }else if(!regex.test(nameInput.value.trim())){
        nameMsg.innerText = "Votre nom ne doit pas contenir de caractères spéciaux :("
        return
    }

    if(adressInput.value.trim().length <= 10){
        adressMsg.innerText = "Votre adresse doit faire plus de 10 lettres :("
        return
    }

    if(cityInput.value.trim().length <= 3){
        cityMsg.innerText = "Votre ville doit faire plus de 3 lettres :("
        return
    }

    if(emailInput.value.trim() === ""){
        emailMsg.innerText = "Veuillez entrer votre adresse :("
        return
    }

    main.innerHTML += `
        <dialog>
            <p>La commande a été passée avec succcès !</p>
            <p>Votre numéro de commande : </p>
            <button id="close-modal">Fermer la fenêtre</button>
        </dialog>
    `

    const dialog = document.querySelector("dialog");
    const closeModal = document.querySelector("#close-modal");

    dialog.showModal();
    closeModal.addEventListener('click', () => {
        dialog.close();
    })

    localStorage.clear(); //Delete localStorage
    const cartItems = [];
})
