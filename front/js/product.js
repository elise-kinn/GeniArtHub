//---------------------------------------------------RECUPERATION DE L'ID DE L'URL DE L'HTML
// window.location.search --> Récupère ce qu'il y a après le ? de l'ULR
// URLSearchParams --> Objet pour lire les paramètres (ici l'ID)
const params = new URLSearchParams(window.location.search); 
//params.get('id') --> extraie la valeure associée à l'id, stokéer dans productId
const productId = params.get('id');


//-------------------------------------------------------FETCH API
async function chargerArticles(){ //Fetch API
    try{
        const req = await fetch('http://localhost:3000/api/products/'); 
        if(!req.ok){
            throw new Error("Error HTTP : ", req.status);
        }
        const datas = await req.json();

        //insersions fonctions nécessistant les datas
        console.log(datas)
        affichageArticle(datas) // affichage article call
        // console.log(datas)
    }catch(e){
        console.error("Error : ", e)
    }
}

chargerArticles(); //Appel fonction api

//------------------------------------------------------CONSTANTES
const img = document.querySelector("figure img"); 
const title = document.querySelector("h1"); 
const smallDesc = document.querySelector(".detailoeuvre article > div > p"); 
const price = document.querySelector("span"); 
const buyBtn = document.querySelector(".button-buy");
const bigDesc = document.querySelector("h2");
const format = document.querySelector('#format');
const titlePage = document.querySelector("title");
const inputQte = document.querySelector('#quantity')
const valideMsg = document.querySelector("#ajout-valide")

// -----------------------------------------------------FONCTION
const affichageArticle = (data) => {
    const product = data.find(el => el._id === productId); // Récupération en fonction de l'url

    if(!product){
        return;
    }

    // Affichage de la page personnalisée en fonction du produit choisi
    titlePage.innerText = `${product.titre} - GeniArtHub` //titre d'onglet
    img.src = product.image; 
    title.innerText = product.titre;
    smallDesc.innerText = `${product.description.slice(0, 150)}...`
    buyBtn.innerText = `Buy ${product.shorttitle}`;
    bigDesc.innerText = product.description;
    price.innerText = `${product.declinaisons[0].prix}€`

    let options = '';
    product.declinaisons.forEach(el => {
        options += `<option value="${el.taille}">${el.taille}</option>`;
    });
    format.innerHTML = options;

    format.addEventListener('change', () => { //modification du prix en temps réel selon les dimensions choisis par l'utilisateur
        switch(format.value){
            case "20 x 20": 
                price.innerText = `${product.declinaisons[0].prix}€`
                break;
            case "30 x 20": 
                price.innerText = `${product.declinaisons[1].prix}€`
                break;
            case "30 x 30": 
                price.innerText = `${product.declinaisons[2].prix}€`
                break;
            case "40 x 30": 
                price.innerText = `${product.declinaisons[3].prix}€`
                break;
            default: 
                price.innerText = `${product.declinaisons[4].prix}€`
                break;
        }
        cleanMsg()
    })

    buyBtn.addEventListener('click', () => { //LOCAL STORAGE
        const key = `${product._id}-${format.value}`; //localStorage key
        let addQte = parseInt(inputQte.value); // quantité présente dans l'input

        if(addQte > 100){addQte = 100} // Restriction quantité
        else if(addQte < 0){addQte = 0}

        articleJSON = localStorage.getItem(key); // null/chaine JSON selon si l'article séléctionné est déja présent ou non
        
        if(!articleJSON){ //si l'article n'est pas présent

            const newItem = { //création de l'objet de stockage
                id: product._id,
                title: product.titre,
                image: product.image,
                format: format.value,
                quantity: addQte,
            };

            localStorage.setItem(key, JSON.stringify(newItem)); // ACTUALISATION

        }else if(articleJSON){ // si l'article est déja présent

            const item = JSON.parse(articleJSON) // Récupération du JSON 
            item.quantity += addQte // Ajout de la nouvelle quantité

            if(item.quantity > 100){item.quantity = 100} // Restriction quantité
            else if(item.quantity < 0){item.quantity = 0}

            localStorage.setItem(key, JSON.stringify(item)); // ACTUALISATION

        }

        valideMsg.innerText = "Votre séléction a bien été ajoutée à votre panier !"
        console.log(localStorage)
        
    })
}

//--------------------------------------------------------ANNEXE

//Supprime le message de l'ajout dans le panier
const cleanMsg = () => {
    valideMsg.innerText = ""
}

inputQte.addEventListener('change', cleanMsg)