async function fetchFissureData() {
    // const response = await fetch('./test-data.json');
    // const fissures = await response.json();
    const fissures = [{
        "id": "6559332eb9b14087f8219611",
        "activation": "2023-11-18T21:57:02.110Z",
        "startString": "-1h 2m 42s",
        "expiry": "2023-11-18T23:55:53.181Z",
        "active": true,
        "node": "Olympus (Mars)",
        "missionType": "Disruption",
        "missionKey": "Disruption",
        "enemy": "Grineer",
        "enemyKey": "Grineer",
        "nodeKey": "Olympus (Mars)",
        "tier": "Lith",
        "tierNum": 1,
        "expired": false,
        "eta": "56m 8s",
        "isStorm": false,
        "isHard": false
    },
    {
        "id": "65593585fd63d3abfa3b6101",
        "activation": "2023-11-18T22:07:01.678Z",
        "startString": "-52m 42s",
        "expiry": "2023-11-18T23:18:36.715Z",
        "active": true,
        "node": "Umbriel (Uranus)",
        "missionType": "Interception",
        "missionKey": "Interception",
        "enemy": "Grineer",
        "enemyKey": "Grineer",
        "nodeKey": "Umbriel (Uranus)",
        "tier": "Neo",
        "tierNum": 3,
        "expired": false,
        "eta": "18m 52s",
        "isStorm": false,
        "isHard": false
    }];
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

    return card;
}

fetchFissureData().then(data => {
    const cardContainer = document.querySelector('.card-container');

    for (const datum of data) {
        const card = createCardElement(datum);
        cardContainer.appendChild(card);
    }
});

