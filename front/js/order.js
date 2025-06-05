async function chargerArticles(){ //Fetch API
    try{
        const req = await fetch('http://localhost:3000/api/products/'); 
        if(!req.ok){
            throw new Error("Error HTTP : ", req.status);
        }
        const datas = await req.json();

        //insersions fonctions nécessistant les datas

    }catch(e){
        console.error("Error : ", e)
    }
}

const buyBtn = document.querySelector('#buy-btn');
const cartContainer = document.querySelector('#panier');

const affichagePanier = () => {
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i); 
        const qte = JSON.parse(localStorage.getItem(key))
        console.log(key, qte)
    }
}

affichagePanier()

buyBtn.addEventListener('click', () => {

    localStorage.clear(); //Delete localStorage
})