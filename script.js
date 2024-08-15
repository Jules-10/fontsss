const allFilters = [
    "serif",
    "sansserif",
    "display",
    "script",
    "slab",
    "monospace",
];
var filtersSelected = [];
var displayedTags = allFilters;

initializeDisplay();

function resetFilters() {
    filtersSelected = [];
    for (const e of allFilters) {
        document.getElementById(e + "Filter").classList.remove("selected");
    }
    updateDisplay();
}
function addFilter(tag) {
    filtersSelected = filtersSelected.filter((x) => x !== tag);
    filtersSelected.push(tag);
    document.getElementById(tag + "Filter").classList.add("selected");
}
function removeFilter(tag) {
    document.getElementById(tag + "Filter").classList.remove("selected");
    filtersSelected = filtersSelected.filter((e) => e !== tag);
}
function toggleFilter(tag) {
    if (
        document.getElementById(tag + "Filter").classList.contains("selected")
    ) {
        removeFilter(tag);
    } else {
        addFilter(tag);
    }
    updateDisplay();
}
function toggleFavorite(e) {
    if (e.classList.contains("isfav")) {
        e.classList.remove("isfav");
        e.classList.add("notfav");
    } else {
        e.classList.add("isfav");
        e.classList.remove("notfav");
    }
}

function toggleTag(e) {
    if (e.classList.contains("selected")) {
        e.classList.remove("selected");
    } else {
        e.classList.add("selected");
    }
}

function updateFontSize() {
    var fontSize = document.getElementById("textsizing").value;
    document
        .querySelector(":root")
        .style.setProperty("--displayFontSize", fontSize + "px");
}
function updateTextDisplay(v) {
    const fontsText = document.getElementsByClassName("text");
    for (const e of fontsText) {
        e.innerHTML = v;
    }
}

function refreshDisplay() {
    const fonts = document.getElementsByClassName("font");
    for (const font of fonts) {
        var display = false;
        for (const tag of displayedTags) {
            if (font.classList.contains(tag)) {
                display = true;
            }
        }
        if (display) {
            font.style.display = "flex";
        } else {
            font.style.display = "none";
        }
    }
}

function updateDisplay() {
    if (filtersSelected.length == 0) {
        displayedTags = allFilters;
    } else {
        displayedTags = filtersSelected;
    }
    refreshDisplay();
}

function addFont() {
    document.getElementById("addFontName").value = "";
    for (const e of allFilters) {
        document.getElementById(e + "Tag").classList.remove("selected");
    }
    document.getElementById("addFontWindow").style.display = "flex";
}
function hideFontAdder() {
    document.getElementById("addFontWindow").style.display = "none";
}

function generateHTMLFontBlock(name, tags) {
    var tagsString = "";
    var tagsHTML = "";
    for (const t of tags) {
        tagsString += t + " ";
        tagsHTML += `                        <div class="tag">${t}</div>\n`;
    }

    return `        <div class="font ${tagsString}" id="font_${name}">
            <div class="favtag notfav" onclick="toggleFavorite(this)"> 
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.0979 3.8541C34.6966 2.01148 37.3034 2.01148 37.9021 3.8541L44.5315 24.2574C44.7993 25.0814 45.5672 25.6393 46.4336 25.6393H67.8869C69.8243 25.6393 70.6299 28.1186 69.0625 29.2574L51.7064 41.8673C51.0054 42.3765 50.7121 43.2793 50.9799 44.1033L57.6093 64.5066C58.208 66.3492 56.099 67.8814 54.5316 66.7426L37.1756 54.1327C36.4746 53.6235 35.5254 53.6235 34.8244 54.1327L17.4684 66.7426C15.901 67.8814 13.792 66.3492 14.3907 64.5066L21.0201 44.1033C21.2879 43.2793 20.9946 42.3765 20.2936 41.8673L2.93754 29.2574C1.37011 28.1186 2.17566 25.6393 4.11311 25.6393H25.5664C26.4328 25.6393 27.2007 25.0814 27.4685 24.2574L34.0979 3.8541Z" stroke-width="4"/></svg>
            </div>
                <div class="presentation">
                    <div class="tags">
${tagsHTML}                    </div>
                    <div class="nom">${name}</div>
                </div>
                <div class="text" style="font-family:${name};">Portez ce vieux whisky au juge blond qui fume</div>
            <div class="deleteFont" onclick="removeFont('${name}')">
                <svg width="77" height="77" viewBox="0 0 77 77" xmlns="http://www.w3.org/2000/svg"><path d="M3.35355 2.64645L74.0642 73.3571M2.64645 73.3571L73.3571 2.64646" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
        </div>`;
}

function addFontToHTML(name, tags) {
    const container = document.getElementById("fontsdisplay");
    container.innerHTML =
        generateHTMLFontBlock(name, tags) + container.innerHTML;
}

function removeFont(name) {
    removeFontFromHTML(name);
    removeFontFromJSON(name);
}

function removeFontFromHTML(e) {
    document.getElementById("font_" + e).remove();
}

async function readJSON() {
    try {
        const storedData = localStorage.getItem("fontsData"); // Get from local storage
        if (storedData) {
            return JSON.parse(storedData); // Parse the stored data
        } else {
            // If no data is stored, use the initial fonts.json content
            const response = await fetch("fonts.json");
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error("Error reading JSON:", error);
    }
}

async function addFontToJSON(name, tags) {
    const fontsData = await readJSON();
    fontsData.fonts.push({ name: name, tags: tags });
    try {
        localStorage.setItem("fontsData", JSON.stringify(fontsData)); // Save to local storage
    } catch (error) {
        console.error("Error saving to local storage:", error);
    }
}

async function removeFontFromJSON(fontName) {
    try {
        const fontsData = await readJSON();
        const indexToRemove = fontsData.fonts.findIndex(
            (font) => font.name === fontName,
        ); // Find the index of the font with the given name
        fontsData.fonts.splice(indexToRemove, 1); // Remove the font
        localStorage.setItem("fontsData", JSON.stringify(fontsData)); // Save to local storage
    } catch (error) {
        console.error("Error removing font:", error);
    }
}

async function copyToClipboard() {
    var content = await readJSON();
    navigator.clipboard.writeText(
        `{\n"fonts":${JSON.stringify(content.fonts)}\n}`,
    );
    alert("The new font has been added and the file is now in your clipboard.");
}

function submitNewFont() {
    var name = document.getElementById("addFontName").value;
    var tagsList = [];
    for (const e of allFilters) {
        var x = document.getElementById(e + "Tag");
        if (x.classList.contains("selected")) {
            tagsList.push(e);
        }
    }
    hideFontAdder();
    addFontToJSON(name, tagsList);
    addFontToHTML(name, tagsList);
    refreshDisplay();
    copyToClipboard();
}

async function initializeDisplay() {
    const json = await readJSON();
    const fonts = json.fonts;
    for (const font of fonts) {
        addFontToHTML(font["name"], font["tags"]);
    }
}
