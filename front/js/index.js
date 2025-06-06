// ------------------------------------------------------ FETCH API 
async function chargerArticles(){
    try{
        const req = await fetch('http://localhost:3000/api/products/'); 
        if(!req.ok){
            throw new Error("Error HTTP : ", req.status);
        }
        const datas = await req.json();

        //insersions fonctions nécessistant les datas

        affichageArticles(datas) // appel affichage article

    }catch(e){
        console.error("Error : ", e)
    }
}

chargerArticles(); //Appel fetch API

//----------------------------------------------------- CONSTANTES 
const articleContainer = document.querySelector(".products");

// ---------------------------------------------------- FONCTION
//AfFICHAGE DES ARTICLES
const affichageArticles = (data) => { 
    data.forEach((el) => {
        articleContainer.innerHTML += `
            <article>
                <img src="${el.image}" alt="${el.shorttitle}">
                <a href="product.html?id=${el._id}">Buy ${el.shorttitle}</a>
            </article>
        `
    })
}

