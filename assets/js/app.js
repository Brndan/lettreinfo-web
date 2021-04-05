

var minify = require('html-minifier').minify;
const { stripHtml } = stringStripHtml;




function convertirFichier() {
    let contenuFichier = minifie(document.getElementById("afficheHtml").textContent);
    contenuFichier = delTrackers(contenuFichier);

    document.getElementById("afficheHtml").readonly = false
    document.getElementById("afficheHtml").textContent = contenuFichier
    document.getElementById("afficheHtml").readonly = false

    let toDownload = document.createElement('a');
    toDownload.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(contenuFichier));
    toDownload.setAttribute('download', 'lettreinfo.html');
    toDownload.style.display = 'none';
    document.body.appendChild(toDownload);
    toDownload.click();
    document.body.removeChild(toDownload);
}

function pressePapier() {
    let copieTexte = document.querySelector("#afficheHtml");
    copieTexte.select();
    document.execCommand("copy");
}



function delTrackers(contenuFichier) {
    // Retire les balises HTML spécifiées 
    //const stripHtml = require("string-strip-html");
    contenuFichier = stripHtml(contenuFichier, { onlyStripTags: ["html", "script", "meta", "title"], stripTogetherWithTheirContents: ["script", "title"] }).result
    // Retire la Google bar
    contenuFichier = contenuFichier.replace(/<link.*archivebar-desktop.*$/m, "")
    // Retire la mention MC_PREVIEW_TEXT qui est lue par les clients de messagerie
    contenuFichier = contenuFichier.replace(/<span class="mcnPreviewText.*<\/span>/, "")
    // Retire <!doctype html>
    contenuFichier = contenuFichier.replace(/<!doctype html>/, "")
    //contenuFichier = contenuFichier.replace(/<a.*Voir ce mail dans votre navigateur<\/a>/, '')
    return contenuFichier
}

function minifie(contenuFichier) {
    //const CleanCSS = require('clean-css');
    //const minify = require('html-minifier').minify;
    contenuFichier = minify(contenuFichier, {
        minifyCSS: false,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeStyleLinkTypeAttributes: true,
        processConditionalComments: false,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeTagWhitespace: true,
        removeComments: true,

    });
    return contenuFichier
}

async function display(fichierSelectionne) {
    //let fichierSelectionne = element.files[0];
    if (fichierSelectionne.name.match(/\.htm$|\.html$/) == null) {
        alert("Il faut entrer un fichier html.");
        return;
    }
    let text_file = await fichierSelectionne.text();

    document.getElementById("afficheHtml").readonly = false;
    document.getElementById("afficheHtml").textContent = text_file;
    document.getElementById("afficheHtml").readonly = false;
}

function aPropos() {
    versionLettreinfo = "Lettreinfo version 2.1.0";
    document.getElementById("afficheHtml").readonly = false;
    document.getElementById("afficheHtml").textContent = versionLettreinfo;
    document.getElementById("afficheHtml").readonly = false;
}

// Événement pour le bouton "À propos"
const apropos = document.getElementById("apropos");
apropos.addEventListener("click", aPropos);

// Événement pour le bouton "Copier"
const pastebin = document.getElementById("copier");
pastebin.addEventListener("click", pressePapier);

// Événement pour la conversion
const convert = document.getElementById('convertir');
convert.addEventListener("click", convertirFichier);

// Événement pour l’upload avec bouton parcourir
const upload_button = document.getElementById('parcourir');
upload_button.addEventListener("change", () => {
    console.log(upload_button.files[0]);
    display(upload_button.files[0]);
});


// 
const drop_region = document.getElementById('dragndrop');

// Cliquer sur la zone de dragndrop déclenche le sélecteur de fichier
const fakeInput = document.createElement("input");
fakeInput.type = "file";
fakeInput.accept = "text/html";
fakeInput.multiple = false;
drop_region.addEventListener('click', () => {
    fakeInput.click();
});

// Événement pour l’upload en drag ’n drop
drop_region.addEventListener("change", () => {
    console.log(drop_region.files[0]);
    display(drop_region.files[0]);
});


// Fonction et variables pour empêcher le comportement par défaut des navigateurs :
// essayer d'afficher le document
function preventDefault(event) {
    event.preventDefault();
    event.stopPropagation();
}
 
drop_region.addEventListener('dragenter', preventDefault, false);
drop_region.addEventListener('dragleave', preventDefault, false);
drop_region.addEventListener('dragover', preventDefault, false);
drop_region.addEventListener('drop', preventDefault, false);

// Récupérer ce qui est droppé
drop_region.addEventListener('drop', (evenement) => {
    console.log(evenement.dataTransfer);
    file = evenement.dataTransfer.files[0];
    display(file);
    /* console.log(drop_region.files[0]);
    display(drop_region.files[0]); */
}, false);

// Ressource survole la région
drop_region.addEventListener('dragenter', () => {
    drop_region.style.borderColor = "blue";
});

// Ressource lâchée sur la région
/* drop_region.addEventListener('drop', () => {
    drop_region.style.backgroundColor = "green";
}); */

// Le curseur quitte la région
drop_region.addEventListener('dragexit', () => {
    drop_region.style.borderColor = "grey";
});