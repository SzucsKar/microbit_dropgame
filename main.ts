let playerX = 2
let playerY = 4
let caught = 0
led.plot(playerX, playerY)

input.onButtonPressed(Button.A, function () {
    if (playerX > 0) {
        led.unplot(playerX, playerY)
        playerX -= 1
        led.plot(playerX, playerY)
    }
})

input.onButtonPressed(Button.B, function () {
    if (playerX < 4) {
        led.unplot(playerX, playerY)
        playerX += 1
        led.plot(playerX, playerY)
    }
})

for (let dropCount = 0; dropCount < 10; dropCount++) {
    let fallX = randint(0, 4)
    let pauseTime = 900 - Math.round(700 * dropCount / 9)
    for (let fallY = 0; fallY <= 4; fallY++) {
        basic.clearScreen()
        led.plot(playerX, playerY)
        led.plot(fallX, fallY)
        if (fallY === 4 && fallX === playerX) {
            caught += 1
            music.playTone(Note.A, music.beat(BeatFraction.Quarter))
        }
        basic.pause(pauseTime)
    }
}
basic.clearScreen()
basic.showIcon(IconNames.Heart)
basic.showNumber(caught)