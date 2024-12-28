const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const PLANE_VELOCITY = 5
const PROJECTILE_VELOCITY = 8
const ROTATION = 0.08
const FRICTION = 0.97

const projectiles = []

canvas.width = window.innerWidth
canvas.height = window.innerHeight

c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)

class Player {
    constructor({ position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.rotation = 0
    }

    draw() {
        const positionX = this.position.x
        const positionY = this.position.y

        c.save()
        c.translate(positionX, positionY)
        c.rotate(this.rotation)
        c.translate(-positionX, -positionY)

        c.beginPath()
        c.moveTo(positionX, positionY + 10)
        c.lineTo(positionX - 7, positionY + 17)
        c.lineTo(positionX - 7, positionY + 11)
        c.lineTo(positionX - 3, positionY + 8)
        c.lineTo(positionX - 20, positionY + 8)
        c.lineTo(positionX - 20, positionY + 3)
        c.lineTo(positionX - 5, positionY - 5)
        c.lineTo(positionX, positionY - 30)
        c.moveTo(positionX, positionY + 10)
        c.lineTo(positionX + 7, positionY + 17)
        c.lineTo(positionX + 7, positionY + 11)
        c.lineTo(positionX + 3, positionY + 8)
        c.lineTo(positionX + 20, positionY + 8)
        c.lineTo(positionX + 20, positionY + 3)
        c.lineTo(positionX + 5, positionY - 5)
        c.lineTo(positionX, positionY - 30)
        c.lineTo(positionX, positionY - 40)
        c.strokeStyle = 'white'
        c.stroke()

        c.beginPath()
        c.arc(positionX, positionY, 3, 0, Math.PI * 2)
        c.closePath()
        c.fillStyle = 'red'
        c.fill()

        c.restore()
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y -= this.velocity.y
        this.draw()
    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.closePath()
        c.fillStyle = 'white'
        c.fill()
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.draw()
    }
}

const player = new Player({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 }
})

player.draw()

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const curr_projectile = projectiles[i]
        curr_projectile.update()

        const curr_positionX = curr_projectile.position.x
        const curr_positionY = curr_projectile.position.y
        const curr_radius = curr_projectile.radius

        const isOutLeft = curr_positionX - curr_radius <= 0
        const isOutRihgt = curr_positionX + curr_radius >= canvas.width
        const isOutUp = curr_positionY - curr_radius <= 0
        const isOutDown = curr_positionY + curr_radius >= canvas.height

        if (isOutLeft || isOutRihgt || isOutUp || isOutDown) {
            projectiles.splice(i, 1)
        }
    }

    if (keys.w.pressed) {
        player.velocity.x = Math.sin(player.rotation) * PLANE_VELOCITY
        player.velocity.y = Math.cos(player.rotation) * PLANE_VELOCITY
    }
    if (!keys.w.pressed) {
        player.velocity.x *= FRICTION
        player.velocity.y *= FRICTION
    }

    if (keys.d.pressed) player.rotation += ROTATION
    if (keys.a.pressed) player.rotation -= ROTATION
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.w.pressed = true
            break
        case 'KeyA':
        case 'ArrowLeft':
            keys.a.pressed = true
            break
        case 'KeyD':
        case 'ArrowRight':
            keys.d.pressed = true
            break
        case 'Space':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + 40 * Math.sin(player.rotation),
                    y: player.position.y - 40 * Math.cos(player.rotation)
                },
                velocity: {
                    x: Math.sin(player.rotation) * PROJECTILE_VELOCITY,
                    y: - Math.cos(player.rotation) * PROJECTILE_VELOCITY
                }
            }))

            // console.log(projectiles)
            break
    }
})

window.addEventListener('keyup', (event) => {
    // console.log(event)
    switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.w.pressed = false
            break
        case 'KeyA':
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 'KeyD':
        case 'ArrowRight':
            keys.d.pressed = false
            break
    }
})