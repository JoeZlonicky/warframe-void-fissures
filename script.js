const API_URL = 'https://api.warframestat.us/pc/fissures';
const UPDATE_INTERVAL_MS = 60 * 1000;

const tierFilter = {};
const missionTypeFilter = {};
const miscFilter = {};

let cards = [];

async function fetchFissureData() {
    const response = await fetch(API_URL);
    const fissures = await response.json();

    // const fissures = [{
    //     "id": "6559332eb9b14087f8219611",
    //     "activation": "2023-11-18T21:57:02.110Z",
    //     "startString": "-1h 2m 42s",
    //     "expiry": "2023-11-18T23:55:53.181Z",
    //     "active": true,
    //     "node": "Olympus (Mars)",
    //     "missionType": "Disruption",
    //     "missionKey": "Disruption",
    //     "enemy": "Grineer",
    //     "enemyKey": "Grineer",
    //     "nodeKey": "Olympus (Mars)",
    //     "tier": "Lith",
    //     "tierNum": 1,
    //     "expired": false,
    //     "eta": "56m 8s",
    //     "isStorm": false,
    //     "isHard": false
    // },
    // {
    //     "id": "65593585fd63d3abfa3b6101",
    //     "activation": "2023-11-18T22:07:01.678Z",
    //     "startString": "-52m 42s",
    //     "expiry": "2023-11-18T23:18:36.715Z",
    //     "active": true,
    //     "node": "Umbriel (Uranus)",
    //     "missionType": "Interception",
    //     "missionKey": "Interception",
    //     "enemy": "Grineer",
    //     "enemyKey": "Grineer",
    //     "nodeKey": "Umbriel (Uranus)",
    //     "tier": "Neo",
    //     "tierNum": 3,
    //     "expired": false,
    //     "eta": "18m 52s",
    //     "isStorm": false,
    //     "isHard": false
    // }];
    return fissures;
}

function createCardElement(fissureData) {
    const card = document.createElement('div');
    card.className = 'card';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'card-left-column';

    const cardTitle = document.createElement('div');
    cardTitle.className = "card-title";
    cardTitle.textContent = fissureData['nodeKey'];
    if (fissureData['isHard']) {
        cardTitle.textContent += ' - Hard';
    }
    if (fissureData['isStorm']) {
        cardTitle.textContent += ' - Storm';
    }

    leftColumn.appendChild(cardTitle);

    const cardInfo = document.createElement('div');
    cardInfo.className = "card-info";
    cardInfo.textContent = `${fissureData['tier']} - ${fissureData['missionType']} - ${fissureData['enemy']}`;
    leftColumn.appendChild(cardInfo);

    card.appendChild(leftColumn);

    const rightColumn = document.createElement('div');
    rightColumn.className = 'card-right-column';

    const cardTime = document.createElement('div');
    cardTime.className = 'card-time';
    cardTime.textContent = fissureData['eta'];
    rightColumn.appendChild(cardTime);

    card.appendChild(rightColumn);

    
    card['fissureData'] = fissureData;
    return card;
}

function updateCards() {
    for (let card of cards) {
        let data = card['fissureData'];
        if (missionTypeFilter[data['missionType'].toLowerCase()] === false ||
            tierFilter[data['tier'].toLowerCase()] === false ||
            (data['isHard'] && miscFilter['hard'] === false) ||
            (data['isStorm'] && miscFilter['storm'] === false)) {
            card.classList.add('hidden');
        }
        else {
            card.classList.remove('hidden');
        }
    }
}

function removeAllCards() {
    for (let card of cards) {
        card.remove()
    }
    cards.length = 0;
}

function setupFilterButtons(fieldsetSelector, filter) {
    const fieldset = document.querySelector(fieldsetSelector);
    const allButton = fieldset.querySelector('.all-filter-button');
    const noneButton = fieldset.querySelector('.none-filter-button');
    const checkboxes = fieldset.querySelectorAll('input');

    if (allButton) {
        allButton.addEventListener('click', () => {
            for (let checkbox of checkboxes) {
                checkbox.checked = true;
                filter[checkbox.name] = true;
            }
            updateCards();
        });
    }
    
    if (noneButton) {
        noneButton.addEventListener('click', () => {
            for (let checkbox of checkboxes) {
                checkbox.checked = false;
                filter[checkbox.name] = false;
            }
            updateCards();
        });
    }
    
    for (let checkbox of checkboxes) {
        checkbox.addEventListener('click', () => {
            filter[checkbox.name] = checkbox.checked;
            updateCards();
        });
        filter[checkbox.name] = checkbox.checked;
    }
}

async function populateCards() {
    const data = await fetchFissureData();
    const cardContainer = document.querySelector('.card-container');

    for (const datum of data) {
        const card = createCardElement(datum);
        cards.push(card);
        cardContainer.appendChild(card);
    }
}

populateCards().then(() => {
    setupFilterButtons('.tier-fieldset', tierFilter);
    setupFilterButtons('.mission-type-fieldset', missionTypeFilter);
    setupFilterButtons('.other-mission-types-fieldset', missionTypeFilter);
    setupFilterButtons('.misc-fieldset', miscFilter);
    updateCards();

    setInterval(() => {
        removeAllCards();
        populateCards().then(() => updateCards());
    }, UPDATE_INTERVAL_MS);
}); 