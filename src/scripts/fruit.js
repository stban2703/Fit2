let activityUrl = './../src/databases/bdActividades.csv';
let fruitUrl = './../src/databases/bdFrutas.csv';
let activityData = [];
let fruitData = [];

loadData("fruit", fruitUrl);

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