let playerX = 2
let playerY = 4
let role = ""
let gameStarted = false
let lastLaunchTime = 0
let defenderCaught = 0
let defenderMissed = 0

radio.setGroup(1)
radio.setTransmitPower(7)

function plotPlayer() {
    basic.clearScreen()
    led.plot(playerX, playerY)
}

function moveLeft() {
    if (playerX > 0) {
        led.unplot(playerX, playerY)
        playerX -= 1
        led.plot(playerX, playerY)
    }
}

function moveRight() {
    if (playerX < 4) {
        led.unplot(playerX, playerY)
        playerX += 1
        led.plot(playerX, playerY)
    }
}

function showInstructions() {
    basic.showString("A:ATT")
    basic.showString("B:DEF")
    basic.showString("AB:DROP")
}

function showScore() {
    basic.showString("C")
    basic.showNumber(defenderCaught)
    basic.pause(200)
    basic.showString("M")
    basic.showNumber(defenderMissed)
    basic.pause(200)
    plotPlayer()
}

input.onButtonPressed(Button.A, function () {
    if (gameStarted) {
        moveLeft()
    } else {
        role = "attacker"
        gameStarted = true
        basic.showString("ATT")
        plotPlayer()
    }
})

input.onButtonPressed(Button.B, function () {
    if (gameStarted) {
        moveRight()
    } else {
        role = "defender"
        gameStarted = true
        basic.showString("DEF")
        plotPlayer()
    }
})

input.onButtonPressed(Button.AB, function () {
    if (gameStarted && role === "attacker") {
        let now = input.runningTime()
        if (now - lastLaunchTime > 800) {
            radio.sendValue("drop", playerX)
            lastLaunchTime = now
            basic.showIcon(IconNames.SmallSquare)
            basic.pause(200)
            plotPlayer()
        }
    }
})

input.onGesture(Gesture.TiltLeft, function () {
    if (gameStarted) {
        moveLeft()
    }
})

input.onGesture(Gesture.TiltRight, function () {
    if (gameStarted) {
        moveRight()
    }
})

radio.onReceivedValue(function (name, value) {
    if (gameStarted && role === "defender" && name === "drop") {
        for (let fallY = 0; fallY <= 4; fallY++) {
            basic.clearScreen()
            led.plot(playerX, playerY)
            led.plot(value, fallY)
            if (fallY === 4) {
                if (value === playerX) {
                    defenderCaught += 1
                    music.playTone(Note.C, music.beat(BeatFraction.Quarter))
                } else {
                    defenderMissed += 1
                    music.playTone(Note.C, music.beat(BeatFraction.Eighth))
                    music.playTone(Note.G, music.beat(BeatFraction.Eighth))
                }
            }
            basic.pause(300)
        }
        showScore()
    }
})

showInstructions()
plotPlayer()