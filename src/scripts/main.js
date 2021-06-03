const friendsForm = document.querySelector(".friendsForm");
const friendsFormActivityInput = friendsForm.activitiesNumber;
const friendsFormAggregationSelect = friendsForm.aggregationMethod;

let activityUrl = './../src/databases/bdActividades.csv';
let fruitUrl = './../src/databases/bdFrutas.csv';
let activityList = [];
let fruitList = [];
let nameList = [];

loadData("activity", activityUrl);
loadData("fruit", fruitUrl);
loadNameList(activityUrl);

friendsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let selectedFriends = getSelectedFriends();

    console.log(selectedFriends);
    console.log(friendsFormActivityInput.value);
    console.log(friendsFormAggregationSelect.value);
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
                    activityList = results.data;
                    //console.log(activityList);
                    break;
                case "fruit":
                    fruitList = results.data;
                    //console.log(fruitList);
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
            const newFriend = getPersonFromList(activityList, elem.value);
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