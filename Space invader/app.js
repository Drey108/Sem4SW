const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll(".grid div"))

const regularInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

const zigzagInvaders = [
    40, 42, 44, 46, 48, 50, 52, 54, 56, 58,
    70, 72, 74, 76, 78, 80, 82, 84, 86, 88
]

function draw() {
    for (let i = 0; i < regularInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[regularInvaders[i]].classList.add("invader")
        }
    }

    for (let i = 0; i < zigzagInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[zigzagInvaders[i]].classList.add("zigzag")
        }
    }
}

draw()

squares[currentShooterIndex].classList.add("shooter")

function remove() {
    for (let i = 0; i < regularInvaders.length; i++) {
        squares[regularInvaders[i]].classList.remove("invader")
    }
    for (let i = 0; i < zigzagInvaders.length; i++) {
        squares[zigzagInvaders[i]].classList.remove("zigzag")
    }
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = regularInvaders[0] % width === 0
    const rightEdge = regularInvaders[regularInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < regularInvaders.length; i++) {
            regularInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < regularInvaders.length; i++) {
            regularInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < regularInvaders.length; i++) {
        regularInvaders[i] += direction
    }

    for (let i = 0; i < zigzagInvaders.length; i++) {
        if (i % 2 === 0) {
            zigzagInvaders[i] += 1
        } else {
            zigzagInvaders[i] -= 1
        }
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader") || squares[currentShooterIndex].classList.contains("zigzag")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
    }

    if (aliensRemoved.length === regularInvaders.length + zigzagInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId)
    }
}

invadersId = setInterval(moveInvaders, 600)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom")

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            const alienRemoved = regularInvaders.indexOf(currentLaserIndex)
            if (alienRemoved !== -1) aliensRemoved.push(alienRemoved)

            const zigzagAlienRemoved = zigzagInvaders.indexOf(currentLaserIndex)
            if (zigzagAlienRemoved !== -1) aliensRemoved.push(zigzagAlienRemoved)

            results++
            resultDisplay.innerHTML = results
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)
