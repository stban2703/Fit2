const resultListFriendsContainer = document.querySelector(".resultList--friends");
const resultListSimilarityContainer = document.querySelector(".resultList--similarity");
const resultListActivitiesContainer = document.querySelector(".resultList--activities");
const resultListAverageContainer = document.querySelector(".resultList--average");
const resultListUserPreferenceContainer = document.querySelector(".resultList--userPreferences");
const resultListUserScoreContainer = document.querySelector(".resultList--userScore");

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
renderListResult(userFavoriteActivities, "Promedio", resultListUserScoreContainer)


function renderListResult(list, key, htmmlParent) {
    list.forEach((elem) => {
        const liElem = document.createElement("li");
        let text = "";
        if(key == "cosineSimilarity") {
            text = Math.round(elem[key] * 100) + "%";
        } else if(key == "Nombre") {
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