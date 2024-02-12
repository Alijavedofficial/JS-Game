const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1254
canvas.height = 556

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 1.2

const boundary = {
  minX: 0,
  minY: 0,
  maxX: 1190,
  maxY: canvas.height
};


const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc : 'https://images.creativemarket.com/0.1.0/ps/1721867/1280/640/m1/fpnw/wm0/game_background_71-.jpg?1568043225&s=0567ce5959b8540e0458aa952ba408ff'
})

const shop = new Sprite({
  position: {
    x:617,
    y: 129
  },
  imageSrc : '',
  scale : 2.75 ,
  framesMax : 6

})

const player = new fighter({
  position:{
   x: 139,
   y: 0
  },
  velocity:{
   x:0,
   y:10
  },
  offset:{
   x: 0,
   y: 0
  },
  imageSrc : 'Idle.png' ,
  framesMax : 8 ,
  scale : 2.8,
  offset : {
    x: 200,
    y: 189
   },
   sprites : {
    idle : {
      imageSrc : 'Idle.png' ,
      framesMax : 8 
    },
    run : {
      imageSrc : 'Run.png' ,
      framesMax : 8
    },
    jump : {
    imageSrc : 'Jump.png' ,
    framesMax : 2
    },
    fall : {
      imageSrc : 'Fall.png' ,
      framesMax : 2
    },
    attack1 : {
      imageSrc : 'Attack1.png' ,
      framesMax : 6
    },
    attack2 : {
      imageSrc : 'Attack2.png' ,
      framesMax : 6
    },
    takehit : {
      imageSrc : 'Take Hit - white silhouette.png' ,
      framesMax : 4
    },
    death : {
      imageSrc : 'Death.png' ,
      framesMax : 6
    }
   },
   attackbox : {
    offset : {
      x: -100,
      y:0
    },
    width: 170 ,
    height : 50 
   } 
})

const enemy = new fighter({
   position:{
    x: 900,
    y: 100
},
   velocity:{
    x:0,
    y:0
   },
   offset:{
     x: 0,
     y:0
   },
   imageSrc : '/Kenji/Idle.png' ,
  framesMax : 4,
  scale : 2.8,
  offset : {
    x: 200,
    y: 209
   },
   sprites : {
    idle : {
      imageSrc : '/Kenji/Idle.png' ,
      framesMax : 4 
    },
    run : {
      imageSrc : '/Kenji/Run.png' ,
      framesMax : 8
    },
    jump : {
    imageSrc : '/Kenji/Jump.png' ,
    framesMax : 2
    },
    fall : {
      imageSrc : '/Kenji/Fall.png' ,
      framesMax : 2
    },
    attack1 : {
      imageSrc : '/Kenji/Attack1.png' ,
      framesMax : 4
    },
    attack2 : {
      imageSrc : '/Kenji/Attack2.png' ,
      framesMax : 4
    },
    takehit : {
      imageSrc : '/kenji/Take hit.png' ,
      framesMax : 3
    },
    death : {
      imageSrc : '/kenji/Death.png' ,
      framesMax : 7
    }
    
   },
   attackbox : {
    offset : {
      x: 210,
      y: 50
    },
    width: 170 ,
    height : 50 
   }  
   
})

console.log(player)

const keys = {
  a:{
    pressed: false
  },
  d:{
    pressed: false
  },
  ArrowRight:{
    pressed: false
  }, 
   ArrowLeft:{
    pressed:false
  }
}



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect( 0 , 0 ,canvas.width, canvas.height )
    player.update()
    enemy.update()

player.velocity.x = 0
enemy.velocity.x = 0

//Player movement
    if (keys.a.pressed && player.lastkey === 'a'){
      player.velocity.x = -6 
      player.switchSprite('run')
    } else if(keys.d.pressed && player.lastkey === 'd') {
      player.velocity.x = 6
      player.switchSprite('run')
    } else {
      player.switchSprite('idle')
    }


  //jump and fall for player
  if (player.velocity.y < 0 ) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0 ) {
    player.switchSprite('fall')
  }

//Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
      enemy.velocity.x = -5
      enemy.switchSprite('run')
    } else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
      enemy.velocity.x = 5
      enemy.switchSprite('run')
    } else {
      enemy.switchSprite('idle')
    }


  //jump and fall for enemy
  if (enemy.velocity.y < 0 ) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0 ) {
    enemy.switchSprite('fall')
  }

//collision detection
   if(rectangularcollision({
    rectangle1: player,
    rectangle2:enemy
   }) && 
    player.isAttacking && player.framesCurrent === 4 ) {
      enemy.takehit()
      player.isAttacking = false
   gsap.to('#enemyhealth' ,{
    width : enemy.health + '%'
   })
}
  // if player misses then
  if(player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

   if(rectangularcollision({
    rectangle1: enemy,
    rectangle2:player
   }) && 
    enemy.isAttacking && enemy.framesCurrent === 2 ) {
      player.takehit()
      enemy.isAttacking = false
       
      gsap.to('#playerhealth' ,{
        width : player.health + '%'
       })
   }


  // if enemy misses 
  if(enemy.isAttacking && enemy.framesCurrent === 2 ) {
    enemy.isAttacking = false
  }

// setting the boundary for player
  if (player.position.x < boundary.minX) {
    player.position.x = boundary.minX;
  } else if (player.position.x + player.width > boundary.maxX) {
    player.position.x = boundary.maxX - player.width;
  }

  if (player.position.y < boundary.minY) {
    player.position.y = boundary.minY;
  } else if (player.position.y + player.height > boundary.maxY) {
    player.position.y = boundary.maxY - player.height;
  }


  //setting the boundary for enemy
  if (enemy.position.x < boundary.minX) {
    enemy.position.x = boundary.minX;
  } else if (enemy.position.x + enemy.width > boundary.maxX) {
    enemy.position.x = boundary.maxX - enemy.width;
  }

  if (enemy.position.y < boundary.minY) {
    enemy.position.y = boundary.minY;
  } else if (enemy.y + enemy.height > boundary.maxY) {
    enemy.position.y = boundary.maxY - enemy.height;
  }




// end game on health 
if (enemy.health <= 0  || player.health <= 0) {
  determineWinner ({ player, enemy, timerId })
  } 
}

animate()

window.addEventListener('keydown' , (event) => {
  if(!player.dead && !enemy.dead ) {

  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastkey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastkey = 'a'
      break
    case 'w':
      player.velocity.y = -20
      break
    case ' ':
      player.attack()
      break
  }
} 

  if(!player.dead  && !enemy.dead ) {

switch(event.key) {
      case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastkey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastkey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = -20
      break
      case 'ArrowDown':
        enemy.attack()
        break
  }
} 
})

window.addEventListener('keyup' , (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
  console.log(event.key)
})












