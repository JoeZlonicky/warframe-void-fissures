const API_URL = 'https://api.warframestat.us/pc/fissures';
const UPDATE_INTERVAL_MS = 60 * 1000;

const tierFilter = {};
const missionTypeFilter = {};
const miscFilter = {};

let cards = [];

async function fetchFissureData() {
    const response = await fetch(API_URL);
    const fissures = await response.json();

    return fissures;
}

async function repopulateCards() {
    const loadingText = document.querySelector('.content__loading-status-text');

    let data = null;
    try {
        data = await fetchFissureData();
    } catch (err) {
        if (cards.length) {
            removeAllCards();
        }
        loadingText.classList.remove('hidden');
        loadingText.textContent = 'Failed to load :(';
        return;
    }
    
    if (cards.length) {
        removeAllCards();
    }
    
    loadingText.classList.add('hidden');

    const cardContainer = document.querySelector('.card-container');
    for (const datum of data) {
        const card = createCardElement(datum);
        cards.push(card);
        cardContainer.appendChild(card);
    }

    updateCards();
}

function createCardElement(fissureData) {
    const card = document.createElement('div');
    card.className = 'card';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'card__left-column';

    const cardTitle = document.createElement('div');
    cardTitle.className = "card__title";
    cardTitle.textContent = fissureData['nodeKey'];
    if (fissureData['isHard']) {
        cardTitle.textContent += ' - Hard';
    }
    if (fissureData['isStorm']) {
        cardTitle.textContent += ' - Storm';
    }

    leftColumn.appendChild(cardTitle);

    const cardInfo = document.createElement('div');
    cardInfo.className = "card__info";
    cardInfo.textContent = `${fissureData['tier']} - ${fissureData['missionType']} - ${fissureData['enemy']}`;
    leftColumn.appendChild(cardInfo);

    card.appendChild(leftColumn);

    const rightColumn = document.createElement('div');
    rightColumn.className = 'card__right-column';

    const cardTime = document.createElement('div');
    cardTime.className = 'card__time';
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
    const allButton = fieldset.querySelector('.filter-form__all-button');
    const noneButton = fieldset.querySelector('.filter-form__none-button');
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

function setupOverlayToggleButtons() {
    const openButton = document.querySelector('.filter-form__toggle--open');
    const closeButton = document.querySelector('.filter-form__toggle--close');
    const filterForm = document.querySelector('.filter-form');
    const body = document.querySelector('body');

    openButton.addEventListener('click', () => {
        filterForm.classList.add('overlay-enabled');
        body.classList.add('overlay-enabled');
    });

    closeButton.addEventListener('click', () => {
        filterForm.classList.remove('overlay-enabled');
        body.classList.remove('overlay-enabled');
    })
}

setupFilterButtons('.filter-form__tier', tierFilter);
setupFilterButtons('.filter-form__mission-type', missionTypeFilter);
setupFilterButtons('.filter-form__other-mission-type', missionTypeFilter);
setupFilterButtons('.filter-form__misc', miscFilter);
setupOverlayToggleButtons();

repopulateCards().then(() => {
    setInterval(() => {
        repopulateCards();
    }, UPDATE_INTERVAL_MS);
}); 