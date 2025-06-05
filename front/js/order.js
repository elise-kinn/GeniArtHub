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

chargerArticles()

const buyBtn = document.querySelector('#buy-btn');
const cartContainer = document.querySelector('#panier');
const cartItems = [];

const showCart = (data) => {
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i); 
        const storage = JSON.parse(localStorage.getItem(key))
        cartItems.push(storage);
        console.log(storage)

        cartContainer.innerHTML += `
            <article class="article-article">
                <img src="${storage.image}" alt="">
                <h3>${storage.title}</h3>
                <p>Format : ${storage.format}</p>
                <p id="prix-${i}"></p>
                <p>Quantité : <span>${storage.quantity}</span></p>
                <p class="suppr" id="suppr-${i}">Supprimer</p>
            </article>
        `

        showPrice(data, cartItems);
    } 
}

const showPrice = (dataFromAPI, cartItems) => { //data = API // storage = data de l'article
    cartItems.forEach((item, index) => {
        const match = dataFromAPI.find(el => el._id === item.id);

        if(match){
            const matchSize = match.declinaisons.find(el => el.taille === item.format);

            if(matchSize){
                const price = matchSize.prix * item.quantity; // multiplication en fonction de la quantité

                const priceElement = document.getElementById(`prix-${index}`); //Sélection dynamique du price slot
                if(priceElement){
                    priceElement.innerText = `${price} €`; //Affichage
                }
                
            }

        }
    })
}

buyBtn.addEventListener('click', () => {

    localStorage.clear(); //Delete localStorage
})