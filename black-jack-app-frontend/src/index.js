class Thing{
    constructor(val){
        this.val = val
    }
}

function storeBet(value){
    storedBet = new Thing(value)
}
function storeUser(user){
    storedUser = new Thing(user)
}

function listen() {
    let form = document.getElementById('login')
    form.addEventListener("submit", function(ev) {
        ev.preventDefault()
        checkForUser(form.uname.value)
        .then(data => {
            if(data) {
                fetchUser(form.uname.value)
            } else {
                 newUser(form.uname.value)
            }
        })
    })
}
    
function checkForUser(name) {
        return fetch(`http://localhost:7777/users`)
        .then(res => res.json())
        .then(data => {
            let x = false
            data.forEach(user => {
                if (user.name === name) {
                    x = true
                }         
        })
        return x
    })
}

function fetchUser(name) {
    return fetch(`http://localhost:7777/users`)
    .then(res => res.json())
    .then(data => data.forEach(user => {
        console.log(user.name)
        if (user.name === name){
        renderHomePage(user)
      }
    }
    ))
}

function newUser(name) {
    return fetch("http://localhost:7777/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
           name: name,
           money: 500
        })
    }).then(res => res.json())
    .then(data => renderHomePage(data))    
}

function renderHomePage(object) {
    let login = document.querySelector('.container')
    
    login.remove()
    
    userDisplay(object)
}

function userDisplay(object) {
    let anchor = document.getElementById('anchor')
    let div = document.createElement('div')
    let user = document.createElement('h3')
    let money = document.createElement('h3')
    let play = document.createElement('input')
    let form = document.createElement('form')
    let input = document.createElement('input')
    
    
    input.placeholder = "Bet Amount"
    input.id = "betAmount"
    user.className = "user"
    money.className = "money"
    play.innerText = "Play"
    user.innerText = "User: " + object.name
    money.innerText = "Bank: $" + object.money
    div.className = "userData"
    play.type = "submit"
    
    anchor.appendChild(div)
    div.appendChild(user)
    div.appendChild(money)
    div.appendChild(form)
    form.appendChild(input)
    form.appendChild(play)

    form.addEventListener("submit", function(ev) {
        ev.preventDefault()
        startGame(ev.target.betAmount.value, object)
    })
}

function updateMoney(user, bet) {
    let newMoney = parseInt(user.money) + parseInt(bet)
    fetch(`http://localhost:7777/users/${user.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            money: newMoney
        })
    }).then(res => res.json())
    .then(updateduser => user.money = updateduser.money)
}

listen()

const cardsurl = 'http://localhost:7777/cards'

function fetchThis(url){
    return fetch(url)
    .then(res => res.json())
}

function randomCard(cards, hand, dealer, changeactive){
    if(changeactive === true){
        changeActive()
        let card = cards.splice(Math.floor(Math.random()*cards.length), 1);
        renderCard(card[0], dealer);
        addToHand(card[0], hand)
        changeActive()
    } else {
        let card = cards.splice(Math.floor(Math.random()*cards.length), 1);
        renderCard(card[0], dealer);
        addToHand(card[0], hand)
    }
    return cards;
}

function renderCards(cards){
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        renderCard(card)
    }
}

function renderCard(card, dealer){
    const dealerdiv = document.querySelector('#dealer')
    const playerdiv = document.querySelector('#player')
    if(dealer === false){
        const carddiv = document.createElement('div')
        const cardimg = document.createElement('img')
        carddiv.id = "card_" + card.id
        cardimg.src = "." + card.pic
        playerdiv.appendChild(carddiv)
        carddiv.appendChild(cardimg)
    } else if (dealer === true) {
        if(dealerdiv.children.length === 0){
            const carddiv = document.createElement('div')
            const cardimg = document.createElement('img')
            cardimg.src = "." + "/assets/red_back.png"
            dealerdiv.appendChild(carddiv)
            carddiv.appendChild(cardimg)
        } else {
        const carddiv = document.createElement('div')
        const cardimg = document.createElement('img')
        carddiv.id = "card_" + card.id
        cardimg.src = "." + card.pic
        dealerdiv.appendChild(carddiv)
        carddiv.appendChild(cardimg)
        }
    }
}

function addToHand(card, hand){
    hand.push(card)
}

function makeDeck(){
    let deck = []
    return fetchThis(cardsurl)
    .then(cards => {
        for (let i = 0; i < cards.length; i++) {
            deck.push(cards[i])
        }
        return deck
    })
}

function startGame(bet, user){
    storeBet(bet)
    storeUser(user)
    runGame()
}

function runGame(){
    const body = document.querySelector('body')
    if(document.querySelector('#playAgainButton') != null){
        body.removeChild(document.querySelector('#playAgainButton'))
    }
    if(document.querySelector('#playAgainButton1') != null){
        body.removeChild(document.querySelector('#playAgainButton1'))
    }
    if(document.querySelector('#playAgainButton2') != null){
        body.removeChild(document.querySelector('#playAgainButton2'))
    }
    const dealerdiv = document.querySelector('#dealer')
    const playerdiv = document.querySelector('#player')
    playerdiv.innerText = "PLAYERS HAND:"
    dealerdiv.innerText = "DEALERS HAND:"
    makeShoe()
    .then(cards => {
        let hands = initHands(cards)
        let dealerHand = hands[0] 
        let hand = hands[1]
        if(calculateValueTotal(dealerHand) === 21 || calculateValueTotal(hand) === 21){
            caluclateResults(cards, hand, dealerHand)
            return;
        }
        addButtonForHit(cards, hand, dealerHand)
        addButtonForStand(cards, hand, dealerHand)
        addButtonForSplit(cards, hand, dealerHand)
        if(calculateValueTotal(hand) > 8 && calculateValueTotal(hand) < 12){
            addButtonForDoubleDown(cards, hand, dealerHand)
        }
    })
}

function playAgain(hi = ""){
    const body = document.querySelector('body')
    if(document.getElementById('playAgainButton1') != null){
    } else {
        const NewGameButton = document.createElement('button')
        NewGameButton.innerText = "Play Again"
        NewGameButton.id = "playAgainButton" + hi
        body.appendChild(NewGameButton)
        NewGameButton.addEventListener('click',function(){
            const dealerdiv = document.querySelector('#dealer')
            const playerdiv = document.querySelector('#player')
            const splitdiv = document.querySelector('#split')
            dealerdiv.innerHTML = ""
            playerdiv.innerHTML = ""
            splitdiv.innerHTML = ""
            startGame(storedBet.val, storedUser.val)
        })
    }
}

function addButtonForDoubleDown(cards, hand, dealerHand){
    const doubleButton = document.createElement('button')
    doubleButton.innerText = "Double Down"
    doubleButton.id = "doubleButton"
    const body = document.querySelector('body')
    body.appendChild(doubleButton)
    doubleButton.addEventListener('click', function(){
        debugger;
        storedBet.val = storedBet.val * 2
        randomCard(cards, hand, false, false)
        caluclateResults(cards, hand, dealerHand)
        storedBet.val = storedBet.val / 2
    })
}

function caluclateResults(cards, hand, dealerHand, hi = ''){
    const body = document.querySelector('body')
    const splitButton = document.getElementById('splitButton')
    const doubleButton = document.getElementById('doubleButton')
    const standButton = document.querySelector('#standButton')
    const hitButton = document.getElementById('hitButton')
    const standButton1 = document.querySelector('#standButton1')
    const standButton2 = document.querySelector('#standButton2')
    const hitButton1 = document.querySelector('#hitButton1')
    const hitButton2 = document.querySelector('#hitButton2')
    if(hitButton != null){
        body.removeChild(hitButton)
    }
    if(standButton1 != null){
        body.removeChild(standButton1)
    }
    if(standButton2 != null){
        body.removeChild(standButton2)
    }
    if(hitButton1 != null){
        body.removeChild(hitButton1)
    }
    if(hitButton2 != null){
        body.removeChild(hitButton2)
    }
    if(splitButton != null){
        body.removeChild(splitButton)
    }
    if(standButton != null){
        body.removeChild(standButton)
    }
    if(doubleButton != null){
        body.removeChild(doubleButton)
    }
    const dealerdiv = document.querySelector('#dealer')
    dealerdiv.firstElementChild.firstElementChild.src = "." + dealerHand[0].pic
    let playerTotal = calculateValueTotal(hand)
    while(calculateValueTotal(dealerHand) !== false && calculateValueTotal(dealerHand) < 17){
        randomCard(cards, dealerHand, true)
    }
    let dealerTotal = calculateValueTotal(dealerHand)
    if(playerTotal !== false){
        if(dealerTotal === false || playerTotal > dealerTotal){
            console.log(storedBet.val)
            console.log(playerTotal)
            console.log(dealerTotal)
            console.log("WIN")
            updateMoney(storedUser.val, storedBet.val)
        } else if(dealerTotal == 21 && dealerTotal == playerTotal && dealerHand.length == 2 && hand.length > 2){
            console.log(storedBet.val)
            console.log(playerTotal)
            console.log(dealerTotal)
            console.log("Lose : (")
        } else if(dealerTotal == 21 && dealerTotal == playerTotal && hand.length == 2 && dealerHand.length > 2){
            console.log(storedBet.val)
            console.log(playerTotal)
            console.log(dealerTotal)
            console.log("WIN")
        } else if (dealerTotal == playerTotal){
            console.log(storedBet.val)
            console.log(playerTotal)
            console.log(dealerTotal)
            console.log("Push")
        } else {
            console.log(storedBet.val)
            console.log(playerTotal)
            console.log(dealerTotal)
            console.log("Lose : (")
        }
    } else {
        console.log(storedBet.val)
        console.log(playerTotal)
        console.log(dealerTotal)
        console.log("Lose : (")
    }
    playAgain(hi)
}
    
hello.counter = 0
hello.hands = []
    
function initHands(cards){
    let rarr = []
    let dealerHand = []
    let hand = []
    cards = randomCard(cards, dealerHand, true)
    cards = randomCard(cards, dealerHand, true)
    cards = randomCard(cards, hand, false)
    cards = randomCard(cards, hand, false)
    rarr.push(dealerHand)
    rarr.push(hand)
    return rarr
}

function addButtonForSplit(cards, hand, dealerHand){
    const splitButton = document.createElement('button')
    splitButton.innerText = "Split"
    splitButton.id = "splitButton"
    //hand[0].name.split(' ')[0] === hand[1].name.split(' ')[0] && hand.length < 3
    if(hand[0].name.split(' ')[0] === hand[1].name.split(' ')[0] && hand.length < 3){
        const body = document.querySelector('body')
        body.appendChild(splitButton)
        splitButton.addEventListener('click', function(){
            body.removeChild(splitButton)
            createSplitHands(cards, hand, dealerHand)
        })
    }
}

function createSplitHands(cards, hand, dealerHand){
    let body = document.querySelector('body')
    let splitdiv = document.getElementById("split")
    let hitButton = document.getElementById('hitButton')
    let standButton = document.getElementById('standButton')
    splitdiv.innerText = 'PLAYERS SECOND CARDS:'
    let hand1 = hand[0]
    let hand2 = hand[1]
    unrenderPlayerCards()
    renderCard(hand1, false)
    changeActive()
    renderCard(hand2, false)
    changeActive()
    body.removeChild(hitButton)
    body.removeChild(standButton)
    let newhand = [hand1]
    addButtonForHit(cards, newhand, dealerHand, false, "1")
    addButtonForStandSplit(cards, newhand, dealerHand, "1")
    let secondnewhand = [hand2]
    addButtonForHit(cards, secondnewhand, dealerHand, true, "2")
    addButtonForStandSplit(cards, secondnewhand, dealerHand , "2")
}

function addButtonForStandSplit(cards, hand, dealerHand, hi){
    const standButton = document.createElement('button')
    standButton.innerText = "Stand"
    standButton.id = "standButton" + hi
    const body = document.querySelector('body')
    body.appendChild(standButton)
    standButton.addEventListener('click',function(e){
        hello(cards, hand, dealerHand)
        e.target.removeEventListener(e.type, arguments.callee);
    })
}

function hello(cards, hand, dealerHand){
    hello.counter += 1
    hello.hands.push(hand)
    if(hello.counter >= 2){
        for (let i = 0; i < hello.hands.length; i++) {
            const newhand = hello.hands[i];
            caluclateResults(cards, newhand, dealerHand, i+1)
        }      
    }
}

function changeActive(){
    let splitdiv = document.getElementById("split")
    let playerdiv = document.getElementById('player')
    splitdiv.id = 'player'
    playerdiv.id = 'split'
}

function unrenderPlayerCards(){
    let playerdiv = document.getElementById('player')
    playerdiv.firstElementChild.remove()
    playerdiv.firstElementChild.remove()
}

function addButtonForHit(cards, hand, dealerHand, changeactive = false, hi = ""){
    const hitButton = document.createElement('button')
    hitButton.id = "hitButton" + hi
    hitButton.innerText = "Hit"
    const body = document.querySelector('body')
    body.appendChild(hitButton)
    hitButton.addEventListener('click',function(){
        if(body.querySelector('#splitButton') != null){
            body.removeChild(body.querySelector('#splitButton'))
        }
        randomCard(cards, hand, false, changeactive)
        if(calculateValueTotal(hand) == false || calculateValueTotal(hand) == 21){
            caluclateResults(cards, hand, dealerHand)
        }
    })
}

function addButtonForStand(cards, hand, dealerHand){
    const standButton = document.createElement('button')
    standButton.innerText = "Stand"
    standButton.id = "standButton"
    const body = document.querySelector('body')
    body.appendChild(standButton)
    standButton.addEventListener('click',function(){
        caluclateResults(cards, hand, dealerHand)
    })
}

function makeShoe(){
    let shoe = []
    return fetchThis(cardsurl)
    .then(cards => {
        for (let j = 0; j < 6; j++) {
            for (let i = 0; i < cards.length; i++) {
                shoe.push(cards[i])
            }
        }
        return shoe
    })
}

function calculateValueTotal(hand){
    let total = 0;
    let aceTotal = 0;
    let numAces = 0;
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if(card.value == "1,11"){
            numAces++
        } else {
         total = total + parseInt(card.value)
        }
    }
    if(numAces > 0){
        aceTotal = total
        for (let i = 0; i < numAces; i++) {
            if(aceTotal + 11 <= 21){
                aceTotal = aceTotal + 11
            } else{
                aceTotal++
            }
        }
    }
    if(total <= 21 && aceTotal <= 21){
        if(numAces > 0){
            return aceTotal
        } else { 
            return total
        }
    } else {
        return false
    }
}

