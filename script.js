// ===============================
// Rallye Patrimoine
// Version 1.0
// ===============================

let parcours = [];
let etapeActuelle = 0;

// ===============================
// Registre des gagnants
// ===============================

const URL_REGISTRE =
"https://script.google.com/macros/s/AKfycbz6KB529kofP7ezXxgNr2pGUe6qDG39-RQg2dq72IOe_i_xOs4TE_21PI0gqe5MawKM/exec";

// ===============================
// Envoi du pseudo au registre
// ===============================

function enregistrerDecouverte(callback) {

    const pseudo = localStorage.getItem("rallye-pseudo");

    if (!pseudo) {

        console.log("Aucun pseudo trouvé.");

        return;

    }


    const script = document.createElement("script");

    const callbackName =
        "rallyeReponse_" + Date.now();


    window[callbackName] = function(reponse) {

        console.log("Réponse du registre :", reponse);


        // Supprimer le script après utilisation

        document.body.removeChild(script);

        delete window[callbackName];


        // Donner la réponse à la fonction appelante

        if (callback) {

            callback(reponse);

        }

    };


    script.src =
        URL_REGISTRE +
        "?action=gagnant" +
        "&pseudo=" +
        encodeURIComponent(pseudo) +
        "&callback=" +
        callbackName;


    document.body.appendChild(script);

}

// ===============================
// Easter Egg du puits
// ===============================

let etatPuits = 0;

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

    if (!ecran) {
        console.error("Étape introuvable :", etapeActuelle);
        return;
    }

    const contenu = document.querySelector(".carte");
    const defi = document.querySelector(".defi");
    const boutonSuivant = document.getElementById("suivant");
    const boutonPrecedent = document.getElementById("precedent");
    const fenetrePlan = document.getElementById("fenetrePlan");
const fermerPlan = document.getElementById("fermerPlan");
const navigation = document.querySelector(".navigation");

    // =======================================
    // RESTAURER LA STRUCTURE NORMALE DE LA CARTE
    // =======================================

    contenu.innerHTML = `
        <img src="" alt="Illustration">
        <h2></h2>
        <p></p>
    `;

    // =======================================
    // Récupérer les éléments
    // =======================================

    const titre = contenu.querySelector("h2");
    const texte = contenu.querySelector("p");
    const image = contenu.querySelector("img");

    // =======================================
    // Titre
    // =======================================

    titre.textContent =
        ecran.icone + " " + ecran.titre;

    // =======================================
    // Texte
    // =======================================

    texte.textContent = ecran.texte;

    // =======================================
    // Image
    // =======================================

    etatPuits = 0;

    image.onclick = null;
    image.style.cursor = "default";

    if (ecran.image) {

        image.src = ecran.image;
        image.style.display = "block";

    } else {

        image.style.display = "none";

    }

    // =======================================
    // Easter Egg : le puits devient cliquable
    // =======================================

    if (ecran.id === 11) {

        image.style.cursor = "pointer";

        image.onclick = function () {

            if (etatPuits === 0) {

                image.src = "puits_ouvert.jpg";
                etatPuits = 1;
                return;

            }

            if (etatPuits === 1) {

                afficherParchemin();
                etatPuits = 2;
                return;

            }

        };

    }

    // =======================================
    // Défi
    // =======================================

    if (ecran.defi === "") {

        defi.style.display = "none";

    } else {

        defi.style.display = "block";
        defi.querySelector("p").textContent = ecran.defi;

    }

    // =======================================
    // Bouton
    // =======================================

// =======================================
// BOUTON PLAN
// =======================================

// Supprimer un éventuel ancien bouton
const ancienBoutonPlan = document.getElementById("boutonPlan");

if (ancienBoutonPlan) {
    ancienBoutonPlan.remove();
}

// Le bouton apparaît uniquement sur les pages "indice"
if (ecran.type === "indice") {

    const boutonPlan = document.createElement("button");

    boutonPlan.id = "boutonPlan";
    boutonPlan.className = "bouton-plan";
    boutonPlan.textContent = "🗺️ PLAN";

    // On place le bouton juste sous la zone de navigation
    navigation.insertAdjacentElement("afterend", boutonPlan);

    boutonPlan.onclick = function () {

        const fenetrePlan =
            document.getElementById("fenetrePlan");

        if (fenetrePlan) {
            fenetrePlan.style.display = "flex";
        }

    };

}
    
    boutonSuivant.textContent = ecran.bouton;

    if (etapeActuelle === 0) {

        boutonPrecedent.style.display = "none";

    } else {

        boutonPrecedent.style.display = "block";

    }

    // =======================================
    // Progression
    // =======================================

    const totalEtapes =
        parcours.filter(x => x.type === "etape").length;

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
            behavior: "instant"
        });

    }, 50);

}

// Bouton suivant

document.getElementById("suivant").addEventListener("click",()=>{

    if(etapeActuelle<parcours.length-1){

        changerEtape(etapeActuelle+1);

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

        changerEtape(etapeActuelle-1);

    }

});

// ===============================
// PARCHEMIN SECRET
// ===============================

function afficherParchemin(){

    const carte=document.querySelector(".carte");
    const defi=document.querySelector(".defi");
    const navigation=document.querySelector(".navigation");

    defi.style.display="none";
    navigation.style.display="none";

    carte.innerHTML=`

        <div class="parchemin">

<h3>📜 Secret du vieux puits</h3>

<p><strong>Félicitations&nbsp;!</strong></p>

<p>
Vous faites partie des rares explorateurs ayant découvert
le secret caché dans le vieux puits.
</p>

<p>
Depuis des générations, peu de visiteurs ont remarqué ce passage oublié. Vous venez de retrouver l'une des anciennes clefs du village.
</p>

<p>
Touchez ce parchemin pour poursuivre votre découverte…
</p>

`;

    carte.querySelector(".parchemin").onclick = function(){

        afficherClef();

  };

}
        
// ===============================
// CLEF SECRETE
// ===============================

function afficherClef(){

    const carte=document.querySelector(".carte");

    carte.innerHTML=`

        <div class="clef-container">

            <img 
            src="clef.png"
            class="clef"
            id="clefSecrete">

            <p>
            Une ancienne clef vient d'être découverte...
            </p>

        </div>

    `;


    const clef=document.getElementById("clefSecrete");


    // Animation d'apparition de la clef

    setTimeout(()=>{

        clef.classList.add("apparition");

    },100);


    // =======================================
    // CLIC SUR LA CLEF
    // =======================================

    clef.onclick=function(){

        // Empêcher plusieurs clics

        clef.onclick=null;


        // Enregistrer la découverte auprès
        // du registre Google

        enregistrerDecouverte(function(reponse){

            afficherResultatClef(reponse);

        });

    };

}

// ===============================
// RESULTAT DE LA DECOUVERTE DE LA CLEF
// ===============================

function afficherResultatClef(reponse){

    const carte = document.querySelector(".carte");


    // ===============================
    // ERREUR DE COMMUNICATION
    // ===============================

    if(!reponse || !reponse.succes){

        carte.innerHTML = `

            <div class="parchemin">

                <h3>📜 Le secret du puits</h3>

                <p>
                Le secret a bien été découvert.
                </p>

                <p>
                Une erreur empêche toutefois
                l'enregistrement de votre découverte.
                </p>

                <button class="bouton-continuer-secret" id="continuerSecret">
                    Continuer le jeu →
                </button>

            </div>

        `;

        installerBoutonContinuerSecret();

        return;
    }


    // ===============================
    // PSEUDO DEJA ENREGISTRE
    // ===============================

    if(reponse.dejaEnregistre){

        carte.innerHTML = `

            <div class="parchemin">

                <h3>🔑 Secret déjà découvert</h3>

                <p>
                Ce pseudo a déjà été enregistré
                dans le registre.
                </p>

                <p>
                La découverte précédente reste enregistrée.
                </p>

                <button class="bouton-continuer-secret" id="continuerSecret">
                    Continuer le jeu →
                </button>

            </div>

        `;

        installerBoutonContinuerSecret();

        return;
    }


    // ===============================
    // GAGNANT
    // ===============================

    if(reponse.gagnant){

        carte.innerHTML = `

            <div class="parchemin">

                <h3>🎉 Félicitations&nbsp;!</h3>

                <p>
                Vous êtes le
                <strong>${reponse.rang}ᵉ explorateur</strong>
                à découvrir le secret du vieux puits !
                </p>

                <p>
                🗝️ Vous avez trouvé la salle secrète.
                </p>

                <p>
                🎟️ <strong>
                Vous remportez l'un des cinq tickets
                de cinéma offerts par la commune&nbsp;!
                </strong>
                </p>

                <p>
                Présentez cet écran à l'accueil
                de la médiathèque pour récupérer votre cadeau.
                </p>

                <button class="bouton-continuer-secret" id="continuerSecret">
                    Continuer le jeu →
                </button>

            </div>

        `;

        installerBoutonContinuerSecret();

        return;
    }


    // ===============================
    // LES CINQ TICKETS SONT DEJA PARTIS
    // ===============================

    if(reponse.complet){

        carte.innerHTML = `

            <div class="parchemin">

                <h3>🔑 Secret découvert&nbsp;!</h3>

                <p>
                Félicitations&nbsp;!
                Vous avez réussi à découvrir
                le secret du vieux puits.
                </p>

                <p>
                Vous êtes malheureusement arrivé après
                les cinq premiers explorateurs.
                </p>

                <p>
                🎟️ Les cinq tickets de cinéma offerts
                par la commune ont déjà été remportés.
                </p>

                <p>
                Mais vous pouvez être fier d'avoir trouvé
                le passage secret&nbsp;!
                </p>

                <button class="bouton-continuer-secret" id="continuerSecret">
                    Continuer le jeu →
                </button>

            </div>

        `;

        installerBoutonContinuerSecret();

        return;
    }
}


// =======================================
// BOUTON CONTINUER APRES LE SECRET
// =======================================

function installerBoutonContinuerSecret(){

    const boutonContinuer =
        document.getElementById("continuerSecret");

    if(!boutonContinuer) return;

    boutonContinuer.onclick = function(){

        const defi = document.querySelector(".defi");
        const navigation = document.querySelector(".navigation");

        if(defi) defi.style.display = "";
        if(navigation) navigation.style.display = "";

        changerEtape(etapeActuelle + 1);

    };

}
// =======================================
// CHOIX DU PSEUDO
// =======================================

const champPseudo = document.getElementById("pseudo");
const boutonCommencer = document.getElementById("commencer-rallye");
const ecranPseudo = document.getElementById("ecran-pseudo");


// Vérifier si un pseudo existe déjà

const pseudoSauvegarde = localStorage.getItem("rallye-pseudo");

if (pseudoSauvegarde) {

    champPseudo.value = pseudoSauvegarde;

}


// Bouton "Commencer l'aventure"

boutonCommencer.addEventListener("click", () => {

    const pseudo = champPseudo.value.trim();


    // Empêcher un pseudo vide

    if (pseudo === "") {

        champPseudo.focus();

        champPseudo.style.borderColor = "#b94a48";

        return;

    }


    // Enregistrer le pseudo

    localStorage.setItem("rallye-pseudo", pseudo);


    // Faire disparaître l'écran

    ecranPseudo.style.opacity = "0";

    ecranPseudo.style.transition = "opacity .5s ease";


    setTimeout(() => {

        ecranPseudo.style.display = "none";

    }, 500);

});


// Permettre de valider avec la touche Entrée

champPseudo.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        boutonCommencer.click();

    }

});
    
// ===============================
// FERMETURE DU PLAN
// ===============================

document.getElementById("fermerPlan").addEventListener("click", function(){

    document.getElementById("fenetrePlan").style.display = "none";
    
});

// Lancement

chargerParcours();
