// Recomendar actividades al inicio

const friendsForm = document.querySelector(".friendsForm");
const friendsFormActivityInput = friendsForm.activitiesNumber;
const friendsFormAggregationSelect = friendsForm.aggregationMethod;
const friendsFormUserName = friendsForm.userName;

let activityUrl = './../src/databases/bdActividades.csv';
let fruitUrl = './../src/databases/bdFrutas.csv';
let activityData = [];
let fruitData = [];
let nameList = [];
let myStorage = window.localStorage;

loadData("activity", activityUrl);
loadData("fruit", fruitUrl);
loadNameList(fruitUrl);

friendsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let user = getPersonFromList(fruitData, friendsFormUserName.value);
    let selectedFriends = getSelectedFriends();

    if (selectedFriends.length > 0) {
        let activityNumber = friendsFormActivityInput.value;
        let aggregationMethod = friendsFormAggregationSelect.value;
        let activitiesKeys = Object.keys(user).filter(elem => elem != "Nombre");
        let friendsSimilarityList = sortListDescendet(getFriendsSimilarity(user, selectedFriends), "cosineSimilarity");
        let leastMisseryActivityNames = getLeastMisseryList(selectedFriends, Object.keys(user));
        let recommendedActivities = [];
        let userFavoriteActivities = [];

        if (aggregationMethod == "leastMisery") {
            recommendedActivities = getListKeyAverage(leastMisseryActivityNames, friendsSimilarityList)
        } else {
            recommendedActivities = getListKeyAverage(Object.keys(user).filter(elem => elem != "Nombre"), friendsSimilarityList);
        }
        recommendedActivities = sortListDescendet(recommendedActivities, "Promedio").splice(0, activityNumber);

        activitiesKeys.forEach(elem => {
            let object = {
                Nombre: elem,
                Promedio: user[elem]
            }
            userFavoriteActivities.push(object);
        })
        userFavoriteActivities = sortListDescendet(userFavoriteActivities, "Promedio").splice(0, activityNumber);

        myStorage.setItem("user", JSON.stringify(user));
        myStorage.setItem("friendsSimilarityList", JSON.stringify(friendsSimilarityList));
        myStorage.setItem("recommendedActivities", JSON.stringify(recommendedActivities));
        myStorage.setItem("userFavoriteActivities", JSON.stringify(userFavoriteActivities));
        console.log(myStorage.getItem('friendsSimilarityList'))
        location.href = "results2.html";
    } else {
        alert("Debes seleccionar al menos un amigo");
    }
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

function loadNameList(url) {
    Papa.parse(url, {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            let list = results.data;
            nameList = list.map(({ Nombre }) => Nombre);
            renderUserList();
            renderNameOptions();
        }
    });
};

function renderUserList() {
    const userSelect = friendsForm.userName;
    nameList.forEach(elem => {
        const optionElem = document.createElement("option");
        optionElem.innerHTML = `${elem}`
        optionElem.value = `${elem}`;
        userSelect.appendChild(optionElem);
    });
}

function renderNameOptions() {
    const friendCheckBoxSection = document.querySelector(".listSection--friends");
    const friendCheckBoxList = friendCheckBoxSection.querySelector(".listSection__options--friends");
    friendCheckBoxList.innerHTML = ``;
    nameList.forEach(elem => {
        const checkBoxElem = document.createElement("div");
        checkBoxElem.classList.add("checkBox");
        checkBoxElem.innerHTML = `
            <input class="checkBox--friend" type="checkbox" name="${elem}" value="${elem}">
            <label for="${elem}">${elem}</label>
        `
        friendCheckBoxList.appendChild(checkBoxElem);
    });
    friendCheckBoxList.style.height = "400px";
    friendCheckBoxList.style.flexFlow = "column wrap";
}

function getSelectedFriends() {
    let selectedFriends = [];
    const friendCheckBoxList = document.querySelector(".listSection__options--friends");
    const checkBoxes = friendCheckBoxList.querySelectorAll(".checkBox--friend");
    checkBoxes.forEach((elem) => {
        if (elem.checked) {
            const newFriend = getPersonFromList(fruitData, elem.value);
            selectedFriends.push(newFriend);
        }
    })
    return selectedFriends;
}

function getPersonFromList(list, value) {
    let person = list.find(elem => {
        return elem.Nombre == value;
    });
    return person;
}

function getDotProduct(elemA, elemB) {
    let dotProduct = 0;
    let elemProps = Object.keys(elemA)
    elemProps.splice(elemProps.findIndex(elem => elem === "Nombre"), 1);
    for (let i = 0; i < elemProps.length; i++) {
        let prop = elemProps[i];
        dotProduct += (elemA[prop] * elemB[prop]);
    }
    return dotProduct;
}

function getMagnitude(elem) {
    let magnitude = 0;
    let elemProps = Object.keys(elem);
    elemProps.splice(elemProps.findIndex(elem => elem === "Nombre"), 1);
    for (let i = 0; i < elemProps.length; i++) {
        let prop = elemProps[i];
        magnitude += Math.pow(elem[prop], 2);
    }
    return Math.sqrt(magnitude);
}

function getCosineSimilarity(dotProduct, magnitudeA, magnitudeB) {
    let cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
    return cosineSimilarity;
}

function getCosineSimilarityToPercent(value) {
    return Math.round(value * 100);
}

function getFriendsSimilarity(personA, list) {
    let friendsSimilarity = [];
    for (let i = 0; i < list.length; i++) {
        const personB = list[i];
        let dotProduct = getDotProduct(personA, personB);
        let magnitudeA = getMagnitude(personA);
        let magnitudeB = getMagnitude(personB);
        let cosineSimilarity = getCosineSimilarity(dotProduct, magnitudeA, magnitudeB);
        friendsSimilarity.push({
            ...personB,
            cosineSimilarity: cosineSimilarity
        })
    }
    return friendsSimilarity;
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
    leastMisseryList.splice(leastMisseryList.indexOf("Nombre"), 1);
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