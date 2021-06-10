// Frutas con base a actividades

const fruitForm = document.querySelector(".fruitForm");
const fruitFormFruitInput = fruitForm.fruitNumber;
const fruitFormAggregationSelect = fruitForm.aggregationMethod;
const resultListFriendsFruitContainer = document.querySelector(".resultList--friendsFruit");
const resultListSimilarityFruitContainer = document.querySelector(".resultList--similarityFruit");
const resultListFruitsContainer = document.querySelector(".resultList--fruit");
const resultListAverageFruitContainer = document.querySelector(".resultList--averageFruit");
const resultListUserPreferenceFruitContainer = document.querySelector(".resultList--userPreferencesFruit");
const resultListUserScoreFruitContainer = document.querySelector(".resultList--userScoreFruit");
const coincidenceValueQuantityFruitSpan = document.querySelector(".coincidence__value--quantityFruit");
const coincidenceValueAverageFruitSpan = document.querySelector(".coincidence__value--averageFruit");

let activityUrl = './src/databases/bdActividades.csv';
let fruitUrl = './src/databases/bdFrutas.csv';
let activityData = [];
let fruitData = [];

loadData("fruit", fruitUrl);

fruitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let fruitUser = getPersonFromList(fruitData, user.Nombre);
    let fruitNumber = fruitFormFruitInput.value;
    let aggregationMethod = fruitFormAggregationSelect.value;
    let fruitKeys = Object.keys(fruitUser).filter(elem => elem != "Nombre");
    let fruitFriendsList = [];
    let recommendedFruits = [];
    let userFavoriteFruits = [];

    friendsSimilarityList.forEach((elemA) => {
        let newElem = fruitData.find(elemB => {
            return elemB.Nombre === elemA.Nombre;
        })
        fruitFriendsList.push(newElem);
    });

    let leastMiseryFruitNames = getLeastMisseryList(fruitFriendsList, fruitKeys);

    if (aggregationMethod == "leastMisery") {
        recommendedFruits = getListKeyAverage(leastMiseryFruitNames, fruitFriendsList);
    } else {
        recommendedFruits = getListKeyAverage(fruitKeys, fruitFriendsList);
    }
    recommendedFruits = sortListDescendet(recommendedFruits, "Promedio").splice(0, fruitNumber);

    fruitKeys.forEach(elem => {
        let object = {
            Nombre: elem,
            Promedio: fruitUser[elem]
        }
        userFavoriteFruits.push(object);
    })

    userFavoriteFruits = sortListDescendet(userFavoriteFruits, "Promedio").splice(0, fruitNumber);

    renderListResult(friendsSimilarityList, "Nombre", resultListFriendsFruitContainer);
    renderListResult(friendsSimilarityList, "cosineSimilarity", resultListSimilarityFruitContainer);
    renderListResult(recommendedFruits, "Nombre", resultListFruitsContainer);
    renderListResult(recommendedFruits, "Promedio", resultListAverageFruitContainer);
    renderListResult(userFavoriteFruits, "Nombre", resultListUserPreferenceFruitContainer);
    renderListResult(userFavoriteFruits, "Promedio", resultListUserScoreFruitContainer);
    renderCoincidences(recommendedFruits, userFavoriteFruits, coincidenceValueQuantityFruitSpan, coincidenceValueAverageFruitSpan);
    window.location.href = "#friendsSection";
})

function loadData(targetList, url) {
    Papa.parse(url, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            switch (targetList) {
                default:
                case "activity":
                    activityData = results.data;
                    //console.log(activityData);
                    break;
                case "fruit":
                    fruitData = results.data;
                    //console.log(fruitData);
                    break;
            }
        }
    });
}

function getPersonFromList(list, value) {
    let person = list.find(elem => {
        return elem.Nombre == value;
    });
    return person;
}

function getLeastMisseryList(list, keys) {
    let misseryListKeys = [];
    list.forEach(neighbor => {
        keys.forEach(k => {
            if (neighbor[k] < 5) {
                let temp = misseryListKeys.find(elem => {
                    return elem === k;
                })
                if (!temp) {
                    misseryListKeys.push(k);
                }
            }
        })
    });
    let leastMisseryList = [...keys];
    misseryListKeys.forEach(elem => {
        let deleteIndex = leastMisseryList.indexOf(elem);
        leastMisseryList.splice(deleteIndex, 1);
    });
    return leastMisseryList;
}

function getListKeyAverage(keyList, neighborList) {
    let averageList = [];
    keyList.forEach(key => {
        let sum = 0;
        neighborList.forEach(neighbor => {
            sum += neighbor[key];
        });
        let average = sum / (neighborList.length);
        let newObject = {
            Nombre: key,
            Promedio: average
        }
        averageList.push(newObject);
    });
    return averageList;
}

function sortListDescendet(list, key) {
    let copy = list.sort((a, b) => {
        return b[key] - a[key];
    })
    return copy;
}