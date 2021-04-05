
// Imports
var minify = require('html-minifier').minify;
const { stripHtml } = stringStripHtml;

function fileHandler(fileContent) {
    fileContent = minify_html(fileContent);
    fileContent = delTrackers(fileContent);

    document.getElementById("display_html").readonly = false
    document.getElementById("display_html").textContent = fileContent
    document.getElementById("display_html").readonly = true;
}

function file_export() {

    fileContent = document.getElementById("display_html").textContent

    let toDownload = document.createElement('a');
    toDownload.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(fileContent));
    toDownload.setAttribute('download', 'lettreinfo.html');
    toDownload.style.display = 'none';
    document.body.appendChild(toDownload);
    toDownload.click();
    document.body.removeChild(toDownload);
}

function toClipBoard() {
    let TextCopy = document.querySelector("#display_html");
    TextCopy.select();
    document.execCommand("copy");
}


function delTrackers(fileContent) {
    // Retire les balises HTML spécifiées 
    //const stripHtml = require("string-strip-html");
    fileContent = stripHtml(fileContent, { onlyStripTags: ["html", "script", "meta", "title"], stripTogetherWithTheirContents: ["script", "title"] }).result
    // Retire la Google bar
    fileContent = fileContent.replace(/<link.*archivebar-desktop.*$/m, "")
    // Retire la mention MC_PREVIEW_TEXT qui est lue par les clients de messagerie
    fileContent = fileContent.replace(/<span class="mcnPreviewText.*<\/span>/, "")
    // Retire <!doctype html>
    fileContent = fileContent.replace(/<!doctype html>/i, "");
    //contenuFichier = contenuFichier.replace(/<a.*Voir ce mail dans votre navigateur<\/a>/, '')
    return fileContent
}

function minify_html(fileContent) {
    //const CleanCSS = require('clean-css');
    //const minify = require('html-minifier').minify;
    fileContent = minify(fileContent, {
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
    return fileContent;
}

async function display(selectedFile) {
    if (selectedFile.name.match(/\.htm$|\.html$/) == null) {
        alert("Il faut entrer un fichier html.");
        return;
    }
    let text_file = await selectedFile.text();
    fileHandler(text_file);

    /* document.getElementById("display_html").readonly = false;
    document.getElementById("display_html").textContent = text_file;
    document.getElementById("display_html").readonly = false; */
}


// Événement pour le bouton "Copier"
const pastebin = document.getElementById("copy");
pastebin.addEventListener("click", toClipBoard);

// Événement pour l’upload avec bouton browse
const upload_button = document.getElementById('browse');
upload_button.addEventListener("change", () => {
    display(upload_button.files[0]);
});

// Événement pour le bouton "Télécharger"
const download_button = document.getElementById('download');
download_button.addEventListener('click', () => {
    file_export();
});

// Tous les éléments relatifs au drag ’n drop
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
drop_region.addEventListener('drop', (event) => {
    file = event.dataTransfer.files[0];
    display(file);
}, false);

// Ressource survole la région
drop_region.addEventListener('dragenter', () => {
    drop_region.style.borderColor = "#9ecaed";
    drop_region.style.boxShadow = "0 0 10px #9ecaed";
});

// Ressource lâchée sur la région
drop_region.addEventListener('drop', () => {
    drop_region.style.borderColor = "grey";
    drop_region.style.boxShadow = "unset";
});

// Le curseur quitte la région
drop_region.addEventListener('dragexit', () => {
    drop_region.style.borderColor = "grey";
    drop_region.style.boxShadow = "unset";
});