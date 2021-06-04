const resultListFriendsContainer = document.querySelector(".resultList--friendsActivity");
const resultListSimilarityContainer = document.querySelector(".resultList--similarityActivity");
const resultListActivitiesContainer = document.querySelector(".resultList--activitiesActivity");
const resultListAverageContainer = document.querySelector(".resultList--averageActivity");
const resultListUserPreferenceContainer = document.querySelector(".resultList--userPreferencesActivity");
const resultListUserScoreContainer = document.querySelector(".resultList--userScoreActivity");
const coincidenceValueQuantitySpan = document.querySelector(".coincidence__value--quantityActivity");
const coincidenceValueAverageSpan = document.querySelector(".coincidence__value--averageActivity");

let myStorage = window.localStorage;
let user = JSON.parse(myStorage.getItem("user"));
let friendsSimilarityList = JSON.parse(myStorage.getItem("friendsSimilarityList"));
let recommendedActivities = JSON.parse(myStorage.getItem("recommendedActivities"));
let userFavoriteActivities = JSON.parse(myStorage.getItem("userFavoriteActivities"));

renderListResult(friendsSimilarityList, "Nombre", resultListFriendsContainer);
renderListResult(friendsSimilarityList, "cosineSimilarity", resultListSimilarityContainer);
renderListResult(recommendedActivities, "Nombre", resultListActivitiesContainer);
renderListResult(recommendedActivities, "Promedio", resultListAverageContainer);
renderListResult(userFavoriteActivities, "Nombre", resultListUserPreferenceContainer);
renderListResult(userFavoriteActivities, "Promedio", resultListUserScoreContainer);
renderCoincidences(recommendedActivities, userFavoriteActivities, coincidenceValueQuantitySpan, coincidenceValueAverageSpan);

function renderListResult(list, key, htmmlParent) {
    htmmlParent.innerHTML = ``;
    list.forEach((elem) => {
        const liElem = document.createElement("li");
        let text = "";
        if (key == "cosineSimilarity") {
            text = Math.round(elem[key] * 100) + "%";
        } else if (key == "Nombre") {
            text = elem[key].replace(/_/g, ' ');
        } else {
            text = elem[key].toFixed(2);
        }
        liElem.innerHTML = `
            ${text}
        `
        htmmlParent.appendChild(liElem);
    });
}

function renderCoincidences(recommendationLlist, userFavoriteList, counterParent, averageParent) {
    //let counter = getCoincidenceCounter(recommendedActivities, userFavoriteActivities, "Nombre");
    let counter = getCoincidenceCounter(recommendationLlist, userFavoriteList, "Nombre");
    let total = recommendationLlist.length;

    /*coincidenceValueQuantitySpan.innerText = `${counter}/${total}`;
    coincidenceValueAverageSpan.innerText = `${Math.round((counter / total) * 100)}%`*/
    counterParent.innerText = `${counter}/${total}`;
    averageParent.innerText = `${Math.round((counter / total) * 100)}%`
}

function getCoincidenceCounter(listA, listB, key) {
    let coincidenceCounter = 0;
    for (let i = 0; i < listA.length; i++) {
        const elemA = listA[i];

        for (let j = 0; j < listB.length; j++) {
            const elemB = listB[j];
            if(elemA[key] === elemB[key]) {
                coincidenceCounter++;
            }
        }
    }
    return coincidenceCounter;
}