let activityUrl = './../src/databases/bdActividades.csv';
let fruitUrl = './../src/databases/bdFrutas.csv';
let activityList = [];
let fruitList = [];
let nameList = [];

loadData("activity", activityUrl);
loadData("fruit", fruitUrl);
loadNameList(activityUrl);

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
                    console.log(activityList);
                    break;
                case "fruit":
                    fruitList = results.data;
                    console.log(fruitList);
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
            console.log(nameList)
            renderNameOptions();
        }
    });
};

function renderNameOptions() {
    const friendCheckBoxSection = document.querySelector(".listSection--friends");
    const friendCheckBoxList = friendCheckBoxSection.querySelector(".listSection__options--friends");
    friendCheckBoxList.innerHTML = ``;
    nameList.forEach(elem => {
        const checkBoxElem = document.createElement("div");
        checkBoxElem.classList.add("checkBox")
        checkBoxElem.innerHTML = `
            <input type="checkbox" name="${elem}" value="${elem}">
            <label for="${elem}">${elem}</label>
        `
        friendCheckBoxList.appendChild(checkBoxElem);
    });
    friendCheckBoxList.style.height = "400px";
    friendCheckBoxList.style.flexFlow = "column wrap";
}