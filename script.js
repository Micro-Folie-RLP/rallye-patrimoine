// ===============================
// Rallye Patrimoine
// Version 1.0
// ===============================

let parcours = [];
let etapeActuelle = 0;

function changerEtape(nouvelleEtape){

    const carte=document.querySelector(".carte");
    const defi=document.querySelector(".defi");
    const navigation=document.querySelector(".navigation");

    carte.classList.add("animation-sortie");
    defi.classList.add("animation-sortie");
    navigation.classList.add("animation-sortie");

    setTimeout(()=>{

        etapeActuelle=nouvelleEtape;

        localStorage.setItem("rallye-etape",etapeActuelle);

        afficherEtape();

        carte.classList.remove("animation-sortie");
        defi.classList.remove("animation-sortie");
        navigation.classList.remove("animation-sortie");

        carte.classList.add("animation-entree");
        defi.classList.add("animation-entree");
        navigation.classList.add("animation-entree");

        setTimeout(()=>{

            carte.classList.remove("animation-entree");
            defi.classList.remove("animation-entree");
            navigation.classList.remove("animation-entree");

        },450);

    },300);

}

// Chargement des données
async function chargerParcours() {

    const reponse = await fetch("data/parcours.json");
    parcours = await reponse.json();

    // Reprendre la progression si elle existe
    const sauvegarde = localStorage.getItem("rallye-etape");

    if (sauvegarde !== null) {
        etapeActuelle = parseInt(sauvegarde);
    }

    afficherEtape();
}


// Affichage d'une étape
function afficherEtape() {

    const ecran = parcours[etapeActuelle];

    const contenu = document.querySelector(".carte");
    const defi = document.querySelector(".defi");
    const boutonSuivant = document.getElementById("suivant");
const boutonPrecedent = document.getElementById("precedent");

    // Titre
    contenu.querySelector("h2").textContent =
ecran.icone + " " + ecran.titre;

    // Texte
    contenu.querySelector("p").textContent = ecran.texte;

    // Image
    const image = contenu.querySelector("img");

    if (ecran.image) {

        image.src = ecran.image;
        image.style.display = "block";

    } else {

        image.style.display = "none";

    }

    // Défi
    if (ecran.defi === "") {

        defi.style.display = "none";

    } else {

        defi.style.display = "block";
        defi.querySelector("p").textContent = ecran.defi;

    }

    // Bouton
    boutonSuivant.textContent = ecran.bouton;

if(etapeActuelle===0){

    boutonPrecedent.style.display="none";

}else{

    boutonPrecedent.style.display="block";

}

    // Progression

    const totalEtapes = parcours.filter(x => x.type === "etape").length;

    let numero = ecran.numero || 0;

    if (numero === 0) {

        document.querySelector(".progression p").innerHTML =
            "Bienvenue";

        document.querySelector(".remplissage").style.width = "0%";

    } else {

        document.querySelector(".progression p").innerHTML =
            "Étape <strong>" + numero +
            "</strong> sur <strong>" +
            totalEtapes + "</strong>";

        document.querySelector(".remplissage").style.width =
            (numero / totalEtapes * 100) + "%";

    }

setTimeout(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}, 50);

}


// Bouton suivant

document.getElementById("suivant").addEventListener("click",()=>{

    if(etapeActuelle<parcours.length-1){

        etapeActuelle++;

        localStorage.setItem("rallye-etape",etapeActuelle);

        afficherEtape();

    }

    else{

        alert(`🏆

Bravo !

Vous avez terminé le Rallye Patrimoine.

Merci d'avoir participé aux Journées Européennes du Patrimoine.

📸 N'oubliez pas de conserver vos photos !`);

        localStorage.removeItem("rallye-etape");

        etapeActuelle=0;

        afficherEtape();

    }

});

document.getElementById("precedent").addEventListener("click",()=>{

    if(etapeActuelle>0){

        etapeActuelle--;

        localStorage.setItem("rallye-etape",etapeActuelle);

        afficherEtape();

    }

});

// Lancement

chargerParcours();