function listen() {
    let form = document.getElementById('login')
    console.log(form)
    form.addEventListener("submit", function(ev) {
        ev.preventDefault()
        if (checkForUser(form.uname.value)) {
            fetchUser(form.uname.value)
        } else {
            newUser(form.uname.value)
        }
        }
    )}

function checkForUser(name) {
    return fetch(`http://localhost:7777/users`)
    .then(res => res.json())
    .then(data => {
        data.forEach(user => {
        if (user.name === name) {
            return true
        }})
    })}

function fetchUser(name) {
    return fetch(`http://localhost:7777/users`)
    .then(res => res.json())
    .then(data => data.forEach(user => {
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
    .then(data => console.log(data))    
}


function renderHomePage(object) {
    let login = document.querySelector('.container')
    login.hidden = true
    
    userDisplay(object)
}

function userDisplay(object) {
    let header = document.querySelector('header')
    let div = document.createElement('div')
    let user = document.createElement('h3')
    let money = document.createElement('h3')
    let play = document.createElement('button')
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
    
    header.appendChild(div)
    div.appendChild(user)
    div.appendChild(money)
    div.appendChild(form)
    div.appendChild(play)
    form.appendChild(input)

    play.addEventListener("submit", function(ev) {
        ev.preventDefault
        placeholderFunction(bet)}
}

function updateMoney(id, bet) {
    return fetch(`http://localhost:7777/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify ({
            money: money + bet
        })
    }).then(res => res.json())
}

listen()