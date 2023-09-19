console.log("V1.0 : Mon dico anglais")

/*

MON PROGRAMME : 

> Je veux pouvoir donner la définition d'un mot à mes utilisateurs

- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot

*/

// Etape 1 ==> récupérer le mot



const getWordToSearch = () => {
  const card = document.querySelector(".js-card")
  const myForm = document.querySelector("#form")
  myForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const myFormData = new FormData(myForm)
    let wordToSearch = myFormData.get("search")
    console.log("word: ", wordToSearch)
    sendWordToApi(wordToSearch)
    card.classList.remove("card--hidden")
  })
}

// Etape 2 ==> envoyer le mot a l'API

const sendWordToApi = (word) => {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((result) => result.json())
    .then((data) => {
      // Etape 3 ==> récupérer le JSON (la donnée) en lien avec mon mot
      console.log("word data: ", data)
      const infosToShow = extractData(data[0])
      // Etape 4 ==> ajouter le contenu dans le HTML

      // MA VARIANTE INITIALE
      /* appendToHtml(infosToShow, "word", ".js-card-title")
      appendToHtml(infosToShow, "phonetics", ".js-card-phonetic")
      appendToHtml(infosToShow, "partOfSpeech", ".card__part-of-speech") */

      renderToHtml(infosToShow)
      console.log("all info", infosToShow)
    })
    .catch((error) => {
      alert(`${error}, the word does'n t exist`)
    })
}

// Extracton de données 
const extractData = (data) => {
  // 1. word
  const theWord = data.word
  // 2. phonétique
  const phoneticsWord = findProprety(data.phonetics, "text")
  // 3. prononciation (audio)
  const prononciation = findProprety(data.phonetics, "audio")
  // 4. définition(s)
  /* const partOfSpeechValues = findDefinitions(data.meanings)

  const partOfSpeechMeenings = findMeanings(data.meanings) */

  const meanings = data.meanings
  // Retour de l'objet avec les données extraits
  return {
    word: theWord,
    phonetics: phoneticsWord,
    prononciation: prononciation,
    meanings: meanings,
    /* partOfSpeechMeenings: partOfSpeechMeenings */
  }
}

// trouver la propriété
const findProprety = (array, propToFind) => {
  // parcour un tableau 
  // et verifie si le tableau contiens une propriété
  // elle renvois la valeure de la propriété
  for (let prop of array) {
    if (prop.hasOwnProperty(propToFind)) {
      return prop[propToFind]
    }
  }
}
// trouver les types des définitions 
/* const findDefinitions = (array) => {
  let meaningsTabAll = new Array()
  for (let line of array) {
    meaningsTabAll.push(line)
  }
  let partOfSpeechTab = new Array()
  meaningsTabAll.forEach((elem) => {
    partOfSpeechTab.push(elem.partOfSpeech)
  })
  return partOfSpeechTab
}
// MA VARIANTE INITIALE
const findMeanings = (array) => {
  let meaningsTabAlla = new Array()
  for (let line of array) {
    meaningsTabAlla.push(line)
  }
  console.log("tab: ", meaningsTabAlla)
  let definitionsTable = new Array()
  for (let i = 0; i < meaningsTabAlla.length; i++) {
    let currentObj = meaningsTabAlla[i].definitions
    for (let j = 0; j < currentObj.length; j++)
    definitionsTable.push(currentObj[j].definition)
  }
  return definitionsTable
  
} */

// MA VARIANTE INITIALE
/* const appendToHtml = (data, value, where) => {
  let htmlContainer = document.querySelector(where)
  htmlContainer.innerHTML = `<span>${data[value]}</span>`
} */

const renderToHtml = (data) => {
  const title = document.querySelector(".js-card-title")
  title.textContent = data.word
  const phonetic = document.querySelector(".js-card-phonetic")
  phonetic.textContent = data.phonetics
  const list = document.querySelector(".js-card-list")
  list.innerHTML = ""

  // Création d'éléments HTML dynamiques
  for (let i = 0; i <data.meanings.length; i++) {
    const meanings = data.meanings[i]
    const partOfSpeech = meanings.partOfSpeech
    const definition = meanings.definitions[0].definition
    console.log(partOfSpeech)
    console.log(definition)
    
    // ==> Avec innerHTML

    /* list.innerHTML += `
    <li class="card__meaning">
    <p class="card__part-of-speech">${partOfSpeech}</p>
    <p class="card__definition">${definition}</p>
    </li>
    ` */
    
    // Avec la créaton d'éléments (nods)
    
    const li = document.createElement("li")
    li.classList.add("card__meaning")
    const paragraphPOS = document.createElement("p")
    paragraphPOS.textContent = partOfSpeech
    paragraphPOS.classList.add("card__part-of-speech")
    const paragraphDef = document.createElement("p")
    paragraphDef.textContent = definition
    paragraphDef.classList.add("card__definition")
    li.appendChild(paragraphPOS)
    li.appendChild(paragraphDef)
    list.appendChild(li)

    // Ajout de l'audio
    const button = document.querySelector(".js-card-button")
    const audio = new Audio(data.prononciation)
    button.addEventListener("click", () => {
      button.classList.remove("card__player--on")
      button.classList.add("card__player--off")
      audio.play()
    })
    audio.addEventListener("ended", () => {
      button.classList.remove("card__player--off")
      button.classList.add("card__player--on")
    })
  }
}


// Lancement du programme

getWordToSearch()


