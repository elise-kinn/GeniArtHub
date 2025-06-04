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
const format = document.querySelector('#format');

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

const affichageArticle = (data) => {
    const product = data.find(el => el._id === productId);
    console.log("Product : ", product)

    if(product){ //vérification de la présence du produit
        img.src = product.image; 
        title.innerText = product.titre;
        smallDesc.innerText = `${product.description.slice(0, 120)}...`
        buyBtn.innerText = `Buy ${product.shorttitle}`;
        bigDesc.innerText = product.description;
        price.innerText = product.declinaisons[0].prix + "€"
        let options = '';
        product.declinaisons.forEach(el => {
            options += `<option>${el.taille}</option>`;
        });
        format.innerHTML = options;

        format.addEventListener('change', () => {
            switch(format.value){
                case "20 x 20": 
                    price.innerText = product.declinaisons[0].prix + "€"
                    break;
                case "30 x 20": 
                    price.innerText = product.declinaisons[1].prix + "€"
                    break;
                case "30 x 30": 
                    price.innerText = product.declinaisons[2].prix + "€"
                    break;
                case "40 x 30": 
                    price.innerText = product.declinaisons[3].prix + "€"
                    break;
                default: 
                    price.innerText = product.declinaisons[4].prix + "€"
                    break;
            }
        })
    }
}

chargerArticles();