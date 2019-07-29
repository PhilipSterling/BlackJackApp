const cardsurl = 'http://localhost:7777/cards'

function fetchThis(url){
    return fetch(url)
    .then(res => res.json())
}

function randomCard(cards, hand){
        let card = cards.splice(Math.floor(Math.random()*cards.length), 1);
        renderCard(card[0]);
        addToHand(card[0], hand)
        return cards;
}

function renderCards(cards){
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        renderCard(card)
    }
}

function renderCard(card){
    const carddiv = document.createElement('div')
    const cardimg = document.createElement('img')
    const logindiv = document.querySelector('#login')
    carddiv.id = "card_" + card.id
    cardimg.src = "." + card.pic
    logindiv.appendChild(carddiv)
    carddiv.appendChild(cardimg)
}

function addToHand(card, hand){
    hand.push(card)
}

function runGame(){
    fetchThis(cardsurl)
    .then(cards => {
        let dealerHand = []
        cards = randomCard(cards, dealerHand)
        cards = randomCard(cards, dealerHand)
        
    })
}

runGame()
