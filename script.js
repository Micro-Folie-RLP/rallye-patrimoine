// ===============================
// Rallye Patrimoine
// Version 1.0
// ===============================

let parcours = [];
let etapeActuelle = 0;

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
    const bouton = document.querySelector("button");

    // Titre
    contenu.querySelector("h2").textContent = ecran.titre;

    // Texte
    contenu.querySelector("p").textContent = ecran.texte;

    // Image
    const image = contenu.querySelector("img");

    if (ecran.image) {

        image.src = "images/" + ecran.image;
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
    bouton.textContent = ecran.bouton;

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

}


// Bouton suivant

document.querySelector("button").addEventListener("click", () => {

    if (etapeActuelle < parcours.length - 1) {

        etapeActuelle++;

        localStorage.setItem("rallye-etape", etapeActuelle);

        afficherEtape();

    } else {

        alert("Bravo ! Vous avez terminé le Rallye 🎉");

        localStorage.removeItem("rallye-etape");

        etapeActuelle = 0;

        afficherEtape();

    }

});


// Lancement

chargerParcours();