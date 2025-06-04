// window.location.search --> Récupère ce qu'il y a après le ? de l'ULR
// URLSearchParams --> Objet pour lire les paramètres (ici l'ID)
const params = new URLSearchParams(window.location.search); 
//params.get('id') --> extraie la valeure associée à l'id, stokéer dans productId
const productId = params.get('id');

const img = document.querySelector("figure img"); 
const title = document.querySelector("h1"); 
const smallDesc = document.querySelector(".detailoeuvre article > div > p"); 
const price = document.querySelector("span"); 
const buyBtn = document.querySelector(".button-buy");
const bigDesc = document.querySelector("h2");
const format = document.querySelector('format');

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

chargerArticles();

const affichageArticle = (data) => {
    const product = data.find(el => el._id === productId);
    console.log("Product : ", product)

    if(product){ //vérification de la présence du produit
        img.src = product.image; 
        title.innerText = product.titre;
        smallDesc.innerText = `${product.description.slice(0, 120)}...`
        price.innerText = "";
        buyBtn.innerText = `Buy ${product.shorttitle}`;
        bigDesc.innerText = product.description;
        format.innerHTML = `${ product.declinaisons.forEach(el => `<option>${el.taille}</option>`)}`

        console.log()
    }
}