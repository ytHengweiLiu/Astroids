const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const PLANE_VELOCITY = 5
const PROJECTILE_VELOCITY = 8
const ASTROID_VELOCITY = 3
const ROTATION = 0.08
const FRICTION = 0.97

const projectiles = []
const astroids = []

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

class Astroid {
    constructor({position, velocity, radius}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.closePath()
        c.strokeStyle = 'white'
        c.stroke()
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

window.setInterval(() => {
    const index =  Math.floor(Math.random() * 4)
    let new_position_x, new_position_y
    let new_velocity_x, new_velocity_y
    let new_radius = 50 * Math.random() + 10

    switch (index) {
        // left side
        case 0:
            new_position_x = 0 - new_radius
            new_position_y = Math.random() * canvas.height
            break
        // right side
        case 1:
            new_position_x = canvas.width + new_radius
            new_position_y = Math.random() * canvas.height
            break
        // top side
        case 2:
            new_position_x = Math.random() * canvas.width
            new_position_y = 0 - new_radius
            break
        // bottom side
        case 3:
            new_position_x = Math.random() * canvas.width
            new_position_y = canvas.height + new_radius
            break
    }

    const left = new_position_x <= canvas.width / 2
    const right = new_position_x > canvas.width / 2
    const top = new_position_y <= canvas.height / 2
    const bottom = new_position_y > canvas.height / 2
    const horizantally = Math.abs((new_position_x - canvas.width / 2) / (canvas.height / 2))
    const vertically = Math.abs((new_position_y - canvas.height / 2) / (canvas.height / 2) )

    // Astroids Target: Center
    // const horizantally = 1
    // const vertically = 1


    // if (top && left) {
    //     // top left
    //     new_velocity_x = 1 * horizantally
    //     new_velocity_y = 1 * vertically
    // } else if (top && right) {
    //     // top right
    //     new_velocity_x = -1 * horizantally
    //     new_velocity_y = 1 * vertically
    // } else if (bottom && left) {
    //     // bottom left
    //     new_velocity_x = 1 * horizantally
    //     new_velocity_y = -1 * vertically
    // } else if (bottom && right) {
    //     // bottom right
    //     new_velocity_x = -1 * horizantally
    //     new_velocity_y = -1 * vertically
    // }

    // Astroids Target: Player
    new_velocity_x = (player.position.x - new_position_x) / canvas.width * ASTROID_VELOCITY
    new_velocity_y = (player.position.y - new_position_y) / canvas.height * ASTROID_VELOCITY



    astroids.push(
        new Astroid({
            position: {
                x: new_position_x,
                y: new_position_y
            },
            velocity: {
                x: new_velocity_x,
                y: new_velocity_y
            },
            radius: new_radius
        })
    )

    // console.log(horizantally)
    // console.log(vertically)
    // console.log(astroids)
}, 3000)

function collision (projectile, astroid) {
    const diffX = astroid.position.x - projectile.position.x
    const diffY = astroid.position.y - projectile.position.y
    const distance = Math.sqrt(diffX * diffX + diffY * diffY)

    if (distance <= projectile.radius + astroid.radius) return true

    return false
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
        } else {
            for (let j = astroids.length - 1; j >= 0; j--) {
                if (collision(projectiles[i], astroids[j])) {
                    projectiles.splice(i, 1)
                    if (astroids[j].radius >= 30) {
                        astroids[j].radius -= 20
                    } else {
                        astroids.splice(j, 1)
                    }
                }
            }    
        }

    }

    for (let i = astroids.length - 1; i >= 0; i--) {
        const curr_astroid = astroids[i]
        curr_astroid.update()

        const curr_positionX = curr_astroid.position.x
        const curr_positionY = curr_astroid.position.y
        const curr_radius = curr_astroid.radius

        const isOutLeft = curr_positionX + curr_radius <= 0
        const isOutRihgt = curr_positionX - curr_radius >= canvas.width
        const isOutUp = curr_positionY + curr_radius <= 0
        const isOutDown = curr_positionY - curr_radius >= canvas.height

        if (isOutLeft || isOutRihgt || isOutUp || isOutDown) {
            astroids.splice(i, 1)
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
            if (event.repeat) break
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