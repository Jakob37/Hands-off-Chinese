// https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
function getRandomFromArray(items) {
    var item = items[Math.floor(Math.random() * items.length)];
    return item;
}
