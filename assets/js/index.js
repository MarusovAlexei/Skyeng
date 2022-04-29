const userBtn = document.querySelector('.btn').onclick = myFunc;
const containerDiv = document.querySelector('.price__container');
const serviceTypeDiv = document.querySelector('.service-type__container');

// получаем переменную и отправляем в getData
function myFunc() {
    removePrice(containerDiv);
    removePrice(serviceTypeDiv);
    const userInput = document.querySelector('.input').value;
    getData(userInput);
}

// получаем данные по api и ответ распарсим и отправим в distributionValues
async function getData(value) {
    const res = await fetch(`https://corporate-marketing-backend.skyeng.ru/landing/public/v2/prices/by-preferred-link/${value}`);
    const data = await res.json();
    console.log(data)
    distributionValues(data)
}

// делаем массив нужных нам объектов и отправляем их вaddPriceserviceType и addPriceserviceItem
function distributionValues(data) {
    const dataArray = Object.values(data).flat();
    const serviceTypeKeys = ["english_adult_not_native_speaker", "english_adult_native_speaker", "english_adult_not_native_speaker_premium", "english_adult_not_native_speaker_partial_auto_lesson"];
    let serviceTypeKeysObjects = [];

    for (let i = 0; i < serviceTypeKeys.length; i++) {
        dataArray.forEach((item) => {
            if (item.serviceTypeKey == serviceTypeKeys[i]) {
                serviceTypeKeysObjects.push(item);
            }
        });
    }
    addPriceserviceType(serviceTypeKeysObjects);
    addPriceserviceItem(serviceTypeKeysObjects[0]);
}

// создаем переключение между витринами
function addPriceserviceType(serviceTypeKeysObjects) {
    let arrayNameServiceType = ['Русскоязычный преподаватель', 'Англоязычный преподаватель', 'Премиум тариф', 'Дополнительная практика',];

    serviceTypeKeysObjects.forEach((elem, index) => {
        let serviceType = document.createElement('div');
        serviceType.classList.add('new-div__service-type');
        serviceType.innerHTML = `${arrayNameServiceType[index]}`;
        serviceTypeDiv.appendChild(serviceType);
    })

    const changePrice = Array.from(document.querySelectorAll('.new-div__service-type'));

    changePrice.forEach((elem, index) => {
        elem.addEventListener('click', () => {
            removePrice(containerDiv);
            removeBtnClass(changePrice);
            elem.classList.add('new-div__service-type-active');
            addPriceserviceItem(serviceTypeKeysObjects[index]);
        });
    });
}

// создаем конкретную витрину
function addPriceserviceItem(value) {
    for (let i = 0; i < value.positions.length; i++) {
        let priceDiv = document.createElement('div');
        priceDiv.classList.add('new-div');
        containerDiv.appendChild(priceDiv);
        addElement(priceDiv, value, i);
    }
}

// создаем элемент конкретной витрины
function addElement(priceDiv, value, i) {
    let quantity = document.createElement('div');
    let costWithoutDiscount = document.createElement('div');
    let cost = document.createElement('div');
    let sales = document.createElement('div');

    quantity.classList.add('new-elem-div');
    costWithoutDiscount.classList.add('strikethrough-text');
    cost.classList.add('new-elem-div');
    sales.classList.add('new-elem-div');

    quantity.innerHTML = `${value.positions[i].quantity} lessons`;
    cost.innerHTML = `${value.positions[i].cost / value.positions[i].quantity} ${value.positions[i].currency} per lesson`;
    costWithoutDiscount.innerHTML = `${value.positions[i].costWithoutDiscount / value.positions[i].quantity} ${value.positions[i].currency}`;
    sales.innerHTML = `Saving ${value.positions[i].costWithoutDiscount - value.positions[i].cost} ${value.positions[i].currency}`;


    // проверка costWithoutDiscount
    if (value.positions[i].costWithoutDiscount <= value.positions[i].cost || value.positions[i].costWithoutDiscount == 'undefined') {
        priceDiv.appendChild(quantity);
        priceDiv.appendChild(cost);
    } else {
        priceDiv.appendChild(quantity);
        priceDiv.appendChild(costWithoutDiscount);
        priceDiv.appendChild(cost);
        priceDiv.appendChild(sales);
    }
}

// очистка div контенеров
function removePrice(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}


// очистка стиля ctive у неактивных витрин
function removeBtnClass(changePrice) {
    changePrice.forEach(elem => {
        elem.classList.remove('new-div__service-type-active');
    });
}