//window.onload = function(){

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');


let fon = new Image();
fon.src = './space.jpg';

let asteroid = document.getElementById("asteroid");
let asteroid2 = new Image();
asteroid2.src = './asteroid2.png';
let asteroid3 = new Image();
asteroid3.src = './asteroid3.png';
let asterWidth = 60;
let asterHeight = 60;
let aster2Width = 70;
let aster2Height = 70;
let aster3Width = 70;
let aster3Height = 70;

let ship = new Image();
ship.src = './spaceship.png';
let spaceShip = {x:300, y:300, animx:0, animy:0};

let transportShip = new Image();
transportShip.src = './transportShip.png';
let transport = {x:-300, y: 450, animx:0, animy: 0};


let blaster = new Image();
blaster.src = './759090.png';
let expling = new Image();
expling.src = './NicePng_realistic-fire-png_276260.png';
let shipExplosion = new Image();
shipExplosion.src = './NicePng_realistic-fire-png_276260.png';

let spaceShipWidth = 100;
let spaceShipHeight = 50;
let transportWidth = 200;
let transportHeight = 150;

let score = 0;
let missAsterScore = 0;
let lives = 3;
let x = 0;





function drawScore(){
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText("Score: "+score, 8, 20);
}

function drawMissAster(){
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText("Missed Asteroids: "+missAsterScore, 8, 40);
}

function drawLives(){
    context.font = "16px Arial";
    context.fillStyle = "white";
    context.fillText("Lives: "+lives, 8, 60);
}


//Событие
canvas.addEventListener("mousemove", function(event){
    spaceShip.x=event.offsetX-25;
    spaceShip.y=event.offsetY-13;
})
canvas.addEventListener("mousedown", startFire, false);
canvas.addEventListener("mouseup", stopFire, false);

let fireInterval = 0;

function startFire() {
    onFire();
    fireInterval = setInterval(onFire, 300);
}

function stopFire() {
    clearInterval(fireInterval);
}

//Выстрелы
function onFire(){
    blasterFire.push({x:spaceShip.x+40, y:spaceShip.y-25, dx:0, dy:-5.2});
    if(score >= 20){
        blasterFire.push({x:spaceShip.x+40, y:spaceShip.y-25, dx:0.5, dy:-5});
    }
    if(score >= 40){
        blasterFire.push({x:spaceShip.x+40, y:spaceShip.y-25, dx:-0.5, dy:-5});
    }
    //blasterFire.push({x:spaceShip.x+50, y:spaceShip.y-25, dx:0.5, dy:-5});
    //blasterFire.push({x:spaceShip.x+50, y:spaceShip.y-25, dx:-0.5, dy:-5});
}

//Переменная отвечающая за позицию
let aster = [];
let aster2 = [];
let aster3 = [];
let timer = 0;
let blasterFire = [];
let expl = [];
let shipExpl = [];



fon.onload = function(){
    game();
}

//Основной игровой цикл(бесконечнный)
function game(){
    update();
    render();
    drawScore();
    drawMissAster();
    drawLives();
    
    requestAnimationFrame(game);
}



//Функция обновления данный(физика, вычесления)
function update(){
    timer++;

    
    if(timer%60==0){
        aster.push({
            x:Math.random()*650, 
            y:-60, 
            dx:Math.random()*2-1, 
            //что бы они не летели на верх прибавляем 2
            dy:Math.random()*2+2,
            del:0
        });
    }

    if(score >= 20 && timer%60==0){
        aster2.push({
            x:Math.random()*650, 
            y:-70, 
            dx:Math.random()*2-1, 
            //что бы они не летели на верх прибавляем 2
            dy:Math.random()*2+2,
            del:0
        });
    }

    if(score >= 40 && timer%60==0){
        aster3.push({
            x:Math.random()*650, 
            y:-70, 
            dx:Math.random()*2-1, 
            //что бы они не летели на верх прибавляем 2
            dy:Math.random()*2+2,
            del:0
        });
    }


    for(i in blasterFire){
        blasterFire[i].x=blasterFire[i].x+blasterFire[i].dx;
        blasterFire[i].y=blasterFire[i].y+blasterFire[i].dy;
    
        if(blasterFire[i].y<-30)blasterFire.splice(i,1);
    }

    // onFire();
    //Для создания большого колчиства массивов(астероидов)
    //нужен цикл "for" который будет перебирать массивы
    

    //анимация взрыва
    for(i in expl) {
        expl[i].animx=expl[i].animx+0.5;//+0.5 - скорость анимации
        if(expl[i].animx>7) {
            expl[i].animy++;
            expl[i].animx=0
        }
        if(expl[i].animy>7)
        expl.splice(i,1);
    }

    //анимация взрыва корабля
    for(i in shipExpl) {
        shipExpl[i].animx=shipExpl[i].animx+0.3;//+0.5 - скорость анимации
        if(shipExpl[i].animx>7) {
            shipExpl[i].animy++;
            shipExpl[i].animx=0
        }
        if(shipExpl[i].animy>7)
        shipExpl.splice(i,1);
    }

    //Физика
    
    for(i in aster) {
        aster[i].x=aster[i].x+aster[i].dx;
        aster[i].y=aster[i].y+aster[i].dy;

        //Границы
        if(aster[i].x>=650 || aster[i].x<0) aster[i].dx=-aster[i].dx;
        if(aster[i].y>=600) aster.splice(i,1), missAsterScore++;
        
        if(
            aster[i].x - 10 >= transport.x 
            && aster[i].x <= transport.x + transportWidth
            && aster[i].y - 30 >= transport.y
            && aster[i].y <= transport.y + transportHeight){
                expl.push({x:aster[i].x-45, y:aster[i].y-45, animx:0, animy:2});
                aster[i].del=1;
            }
            
        if (
            aster[i].x + asterWidth >= spaceShip.x 
            && aster[i].x <= spaceShip.x + spaceShipWidth
            && aster[i].y + asterHeight >= spaceShip.y
            && aster[i].y <= spaceShip.y + spaceShipHeight 
            
        ) {
            
            shipExpl.push({x:spaceShip.x-45, y:spaceShip.y-45, animx:0, animy:2});
            aster[i].del=1;
            lives--;
            if(lives == 0){
                spaceShip = 0;
                setTimeout(() => {
                    alert('Game Over')
                    document.location.reload()
                }, 1200)
            }
        
        }
    
    //.splice - удаляет элемент массива

    //проверим каждый астероид на столкновение с каждой пулей;
        for (j in blasterFire){
            if(Math.abs(aster[i].x+35-blasterFire[j].x-15)<50 && Math.abs(aster[i].y+25-blasterFire[j].y-15)<25){
                //помечаем астероид на удаление

                //спавн взрыва
                expl.push({x:aster[i].x-35, y:aster[i].y-25, animx:0, animy:2});

                aster[i].del=1;
                score++;
                if(score == 200){
                    setTimeout(() => {
                        alert('You win. Your score ' + score)
                        document.location.reload()
                    }, 1000)
                }
                blasterFire.splice(j,1);break;
            }
            
        }

    //удаляем астероид
    if (aster[i].del==1) {
        aster.splice(i,1);
        //spaceShip = 0;
    }

    
}

for(i in aster2) {
    aster2[i].x=aster2[i].x+aster2[i].dx;
    aster2[i].y=aster2[i].y+aster2[i].dy;

    //Границы
    if(aster2[i].x>=650 || aster2[i].x<0) aster2[i].dx=-aster2[i].dx;
    if(aster2[i].y>=600) aster2.splice(i,1), missAsterScore++;
    
    if (
        aster2[i].x + asterWidth >= spaceShip.x 
        && aster2[i].x <= spaceShip.x + spaceShipWidth
        && aster2[i].y + asterHeight >= spaceShip.y
        && aster2[i].y <= spaceShip.y + spaceShipHeight
    ) {
        
        shipExpl.push({x:spaceShip.x-45, y:spaceShip.y-45, animx:0, animy:2});
        aster2[i].del=1;
        lives--;
        if(lives == 0){
            spaceShip = 0;
            setTimeout(() => {
                alert('Game Over')
                document.location.reload()
            }, 1200)
        }
        
    }

//.splice - удаляет элемент массива

//проверим каждый астероид на столкновение с каждой пулей;
    for (j in blasterFire){
        if(Math.abs(aster2[i].x+35-blasterFire[j].x-15)<50 && Math.abs(aster2[i].y+25-blasterFire[j].y-15)<25){
            //помечаем астероид на удаление

            //спавн взрыва
            expl.push({x:aster2[i].x-35, y:aster2[i].y-25, animx:0, animy:2});

            aster2[i].del=1;
            score++;
            if(score == 200){
                setTimeout(() => {
                    alert('You win. Your score ' + score)
                    document.location.reload()
                }, 1000)
            }
            blasterFire.splice(j,1);break;
        }
        
    }

//удаляем астероид
if (aster2[i].del==1) {
    aster2.splice(i,1);
    //spaceShip = 0;
}


}

for(i in aster3) {
    aster3[i].x=aster3[i].x+aster3[i].dx;
    aster3[i].y=aster3[i].y+aster3[i].dy;

    //Границы
    if(aster3[i].x>=650 || aster3[i].x<0) aster3[i].dx=-aster3[i].dx;
    if(aster3[i].y>=600) aster3.splice(i,1), missAsterScore++;
    
    if (
        aster3[i].x + aster3Width >= spaceShip.x 
        && aster3[i].x <= spaceShip.x + spaceShipWidth
        && aster3[i].y + aster3Height >= spaceShip.y
        && aster3[i].y <= spaceShip.y + spaceShipHeight
    ) {
        
        shipExpl.push({x:spaceShip.x-45, y:spaceShip.y-45, animx:0, animy:2});
        aster3[i].del=1;
        lives--;
        if(lives == 0){
            spaceShip = 0;
            setTimeout(() => {
                alert('Game Over')
                document.location.reload()
            }, 1200)
        }
        
    }

//.splice - удаляет элемент массива

//проверим каждый астероид на столкновение с каждой пулей;
    for (j in blasterFire){
        if(Math.abs(aster3[i].x+35-blasterFire[j].x-15)<50 && Math.abs(aster3[i].y+25-blasterFire[j].y-15)<25){
            //помечаем астероид на удаление

            //спавн взрыва
            expl.push({x:aster3[i].x-35, y:aster3[i].y-25, animx:0, animy:2});

            aster3[i].del=1;
            score++;
            if(score == 200){
                setTimeout(() => {
                    alert('You win. Your score ' + score)
                    document.location.reload()
                }, 1000)
            }
            blasterFire.splice(j,1);break;
        }
        
    }

//удаляем астероид
if (aster3[i].del==1) {
    aster3.splice(i,1);
    //spaceShip = 0;
}


}

}


//Функция отрисовки
function render(){
    context.drawImage(fon, 0, 0, 700, 600);

    context.drawImage(ship, spaceShip.x, spaceShip.y, spaceShipWidth, spaceShipHeight);

    context.drawImage(transportShip, transport.x, transport.y, transportWidth, transportHeight);
    if(lives <= 3){
        setTimeout(() => {
            transport.x++
        },2000)
    }
    if(transport.x == 700 + transportWidth){
        setTimeout(() => {
            transport.x = -300
        }, 500)
    }
    

    for(i in aster){
    context.drawImage(asteroid, aster[i].x, aster[i].y, asterWidth, asterHeight);
}
    for(i in aster2){
        context.drawImage(asteroid2, aster2[i].x, aster2[i].y, aster2Width, aster2Height);
    }

    for(i in aster3){
        context.drawImage(asteroid3, aster3[i].x, aster3[i].y, aster3Width, aster3Height);
    }

    for(i in blasterFire){
        context.drawImage(blaster, blasterFire[i].x, blasterFire[i].y, 20, 30)
    }

    //рисуем взрыв
    for(i in expl){
        context.drawImage(expling,128*Math.floor(expl[i].animx), 128*Math.floor(expl[i].animy), 128, 128, expl[i].x, expl[i].y, 100, 100);
    }
    
    //рисуем взрыв корабля
    for(i in shipExpl){
        context.drawImage(shipExplosion,128*Math.floor(shipExpl[i].animx), 128*Math.floor(shipExpl[i].animy), 128, 128, shipExpl[i].x, shipExpl[i].y, 200, 200);
    }
}



//let aboveOrBelow = spaceShip.y == aster[i].y + 1 || spaceShip.y == aster[i].y - 1;
//let leftToRight = spaceShip.x >= aster[i].x - 1 && spaceShip.x <= aster[i].x + 1;

/*let requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
        window.setTimeout(callback, 1000 / 20);
    }
})();*/

//}

