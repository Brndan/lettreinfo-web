

var minify = require('html-minifier').minify;
const { stripHtml } = stringStripHtml;




function convertirFichier() {
    let contenuFichier = minifie(document.getElementById("afficheHtml").textContent);
    contenuFichier = delTrackers(contenuFichier);
    
    document.getElementById("afficheHtml").readonly = false
    document.getElementById("afficheHtml").textContent = contenuFichier
    document.getElementById("afficheHtml").readonly = false

    let toDownload = document.createElement('a');
    toDownload.setAttribute('href','data:text/html;charset=utf-8,' + encodeURIComponent(contenuFichier));
    toDownload.setAttribute('download','lettreinfo.html');
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

async function display() {
    let fichierSelectionne = document.getElementById('parcourir').files[0];
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

// Événement pour l’upload
const upload = document.getElementById('parcourir');
upload.addEventListener("change", display);
