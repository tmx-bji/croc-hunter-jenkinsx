var canvasBg = document.getElementById("canvasBg");
var contextBg = canvasBg.getContext("2d");
//玩家
var canvasJet = document.getElementById("canvasJet");
var contextJet = canvasJet.getContext("2d");
//敌人表示
var canvasEnemy = document.getElementById("canvasEnemy");
var contextEnemy = canvasEnemy.getContext("2d");
//敌人表示2
var canvasEnemy2 = document.getElementById("canvasEnemy2");
var contextEnemy2 = canvasEnemy2.getContext("2d");
//分数表示栏
var canvasHud = document.getElementById("canvasHud");
var contextHud = canvasHud.getContext("2d");
contextHud.fillStyle = "hsla(0, 0%, 0%, 0.5)";
contextHud.font = "bold 20px Arial";
//生命值表示栏
var canvasHp = document.getElementById("canvasHp");
var contextHp = canvasHp.getContext("2d");
contextHp.fillStyle = "hsla(0, 0%, 0%, 0.5)";
contextHp.font = "bold 20px Arial";
//以上是生命值
var jet1 = new Jet;
var btnPlay = new Button(265, 535, 220, 335);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1e3 / 60);
};
var enemies = [];
var enemies2 = [];//第二种敌人
var enemies3 = [];//第三种敌人

var imgSprite = new Image;
imgSprite.src = "sprite2.png";
imgSprite.addEventListener("load", init, false);
var bgDrawX1 = 0;
var bgDrawX2 = 1600;
//hp

//玩家出不去这个范围   *画面大小*
function moveBg() {
    bgDrawX1 -= 5;
    bgDrawX2 -= 5;
    if (bgDrawX1 <= -1600)
        bgDrawX1 = 1600;
    if (bgDrawX2 <= -1600)
        bgDrawX2 = 1600;
    drawBg();
}
//初始画面 
function init() {
    spawnEnemy(5);
    spawnEnemy2(5);
    drawMenu();
    document.addEventListener("click", mouseClicked, false);
}
//GamePlay画面
function playGame() {
    drawBg();
    startLoop();
    updateHud();
    updatehp();//生命值更新
    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);
}
//敌人发生
function spawnEnemy(numSpawns) {
    for (var i = 0; i < numSpawns; i++) {
        enemies[enemies.length] = new Enemy;
    }
}
//批量敌人描画
function drawAllEnemies() {
    clearContextEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}//敌人发生2
function spawnEnemy2(numSpawns) {
    for (var i = 0; i < numSpawns; i++) {
        enemies2[enemies2.length] = new Enemy2;
    }
}
//批量敌人描画2
function drawAllEnemies2() {
    clearContextEnemy2();
    for (var i = 0; i < enemies2.length; i++) {
        enemies2[i].draw();
    }
}

function loop() {
    if (isPlaying) {
        moveBg();
        jet1.draw();
        drawAllEnemies();
        drawAllEnemies2();
        requestAnimFrame(loop);

    }
}
function startLoop() {
    isPlaying = true;
    loop();
}
function stopLoop() {
    isPlaying = false;
}
function drawBg() {
    contextBg.clearRect(0, 0, gameWidth, gameHeight);
    contextBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX1, 0, 1600, gameHeight);
    contextBg.drawImage(imgSprite, 0, 0, 1600, gameHeight, bgDrawX2, 0, 1600, gameHeight);
}
//初始画面描画
function drawMenu() {
    var srcY = 760;
    contextBg.drawImage(imgSprite, 0, srcY, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}
//分数更新
function updateHud() {
    contextHud.clearRect(0, 0, gameWidth, gameHeight);
    contextHud.fillText("点数: " + jet1.score, 680, 30);//进入gameplay时显示点数
}
//HP更新
function updatehp() {
    contextHp.clearRect(0, 0, gameWidth, gameHeight);
    contextHp.fillText("HP: " + jet1.hp, 30, 30);//进入gameplay时显示点数
}
//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊玩家＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function Jet() {

    this.srcX = 0;
    this.srcY = 510;
    this.drawX = 200;
    this.drawY = 200;
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    this.width = 144;
    this.height = 74;
    this.speed = 5;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
    this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.isSpaceBar = false;
    this.isShooting = false;
    this.bullets = [];
    this.currentBullet = 0;
    for (var i = 0; i < 20; i++)
        this.bullets[this.bullets.length] = new Bullet(this);
    this.score = 0;
    this.hp = 10;
}
//玩家描画
Jet.prototype.draw = function () {
    clearContextJet();
    this.updateCoors();
    this.checkDirection();
    this.checkShooting();
    this.drawAllBullets();
    this.playerCheckHitEnemy();
    this.playerCheckHitEnemy2();
    contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};
//玩家移动？
Jet.prototype.updateCoors = function () {
    //射击
    this.noseX = this.drawX + 100;
    this.noseY = this.drawY + 30;
    //坐标
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
};
//玩家方位确认
Jet.prototype.checkDirection = function () {
    if (this.isUpKey && this.topY > 0) {
        this.drawY -= this.speed;
    }
    if (this.isRightKey && this.rightX < gameWidth) {
        this.drawX += this.speed;
    }
    if (this.isDownKey && this.bottomY < gameHeight) {
        this.drawY += this.speed;
    }
    if (this.isLeftKey && this.leftX > 0) {
        this.drawX -= this.speed;
    }
};
//玩家回收·
Jet.prototype.playRecycle = function () {
    this.drawX = -200;

};
//玩家子弹描画
Jet.prototype.drawAllBullets = function () {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0)
            this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit)
            this.bullets[i].explosion.draw();
        if (this.bullets[i].explosion2.hasHit)
            this.bullets[i].explosion2.draw();
    }
};
//玩家是否在射击
Jet.prototype.checkShooting = function () {
    if (this.isSpaceBar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length)
            this.currentBullet = 0;
    }
    else if (!this.isSpaceBar) {
        this.isShooting = false;
    }
};
//玩家冲突判定1
Jet.prototype.playerCheckHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX && this.drawX <= enemies[i].drawX + enemies[i].width && this.drawY >= enemies[i].drawY && this.drawY <= enemies[i].drawY + enemies[i].height) {
            // this.Explosion3.drawX = jet1.drawX;
            // this.Explosion3.drawY = jet1.drawY;
            // this.Explosion3.hasHit = true;
            this.hp = this.hp - 1;
            if (this.hp <= 0) {
                this.playRecycle();
                isPlaying = false;
                drawMenu();
                // enemies = [];
                // enemies2 = [];
                this.hp=10;
                this.score=0;

            }

            enemies[i].recycleEnemy();
            this.updateHp();


        }
    }
};
//玩家冲突判定2
Jet.prototype.playerCheckHitEnemy2 = function () {
    for (var i = 0; i < enemies2.length; i++) {
        if (this.drawX >= enemies2[i].drawX && this.drawX <= enemies2[i].drawX + enemies2[i].width && this.drawY >= enemies2[i].drawY && this.drawY <= enemies2[i].drawY + enemies2[i].height) {
            // this.Explosion3.drawX = this.jet1.drawX;
            // this.Explosion3.drawY = this.jet1.drawY;
            // this.Explosion3.hasHit = true;
            this.hp = this.hp - 1;
            if (this.hp <= 0) {
                this.playRecycle();
                isPlaying = false;
                this.hp=10;
                this.score=0;
                drawMenu();

                // enemies2 = [];
                // enemies = [];
            }

            enemies2[i].recycleEnemy();
            this.updateHp();

        }
    }
};
//子弹更新
Jet.prototype.updateScore = function (points) {
    this.score += points;
    updateHud();
};
//生命值更新
Jet.prototype.updateHp = function () {
    this.hp -= 1;
    updatehp();//生命值更新
};
function clearContextJet() {
    contextJet.clearRect(0, 0, gameWidth, gameHeight);
}
//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊子弹＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function Bullet(j) {
    this.srcX = 176;
    this.srcY = 501;
    this.drawX = -20;
    this.drawY = 0;
    this.width = 48;
    this.height = 20;
    this.speed = 3;
    this.explosion = new Explosion;
    this.explosion2 = new Explosion2;
    this.jet = j;
}
//子弹描画
Bullet.prototype.draw = function () {
    this.drawX += this.speed;
    contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    this.checkHitEnemy2();
    if (this.drawX > gameWidth)
        this.recycle();
};
//子弹回收
Bullet.prototype.recycle = function () {
    this.drawX = -20;
};
//？？
Bullet.prototype.fire = function (noseX, noseY) {
    this.drawX = noseX;
    this.drawY = noseY;
};
//子弹判定1
Bullet.prototype.checkHitEnemy = function () {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX && this.drawX <= enemies[i].drawX + enemies[i].width && this.drawY >= enemies[i].drawY && this.drawY <= enemies[i].drawY + enemies[i].height) {
            this.explosion.drawX = enemies[i].drawX - this.explosion.width / 2;
            this.explosion.drawY = enemies[i].drawY;
            this.explosion.hasHit = true;
            this.recycle();
            enemies[i].recycleEnemy();
            this.jet.updateScore(enemies[i].rewardPoints);
        }
    }
};
//子弹判定2
Bullet.prototype.checkHitEnemy2 = function () {
    for (var i = 0; i < enemies2.length; i++) {
        if (this.drawX >= enemies2[i].drawX && this.drawX <= enemies2[i].drawX + enemies2[i].width && this.drawY >= enemies2[i].drawY && this.drawY <= enemies2[i].drawY + enemies2[i].height) {
            this.explosion2.drawX = enemies2[i].drawX - this.explosion2.width / 2;
            this.explosion2.drawY = enemies2[i].drawY;
            this.explosion2.hasHit = true;
            this.recycle();
            enemies2[i].recycleEnemy();
            this.jet.updateScore(enemies2[i].rewardPoints);
        }
    }
};
//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊爆炸＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function Explosion() {
    this.srcX = 720;
    this.srcY = 510;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 129;
    this.height = 61;
    this.currentFrame = 0;
    this.totalFrames = 10;
    this.hasHit = false;
}
//爆炸描画
Explosion.prototype.draw = function () {
    if (this.currentFrame <= this.totalFrames) {
        contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    }
    else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};
//爆炸2
function Explosion2() {
    this.srcX = 820;
    this.srcY = 510;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 129;
    this.height = 61;
    this.currentFrame = 0;
    this.totalFrames = 10;
    this.hasHit = false;
}
//爆炸描画2
Explosion2.prototype.draw = function () {
    if (this.currentFrame <= this.totalFrames) {
        contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    }
    else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};
//爆炸3
function Explosion3() {
    this.srcX = 820;
    this.srcY = 610;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 129;
    this.height = 61;
    this.currentFrame = 0;
    this.totalFrames = 10;
    this.hasHit = false;
}
//爆炸描画3
Explosion3.prototype.draw = function () {
    if (this.currentFrame <= this.totalFrames) {
        contextJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    }
    else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};
//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊敌人情报＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
function Enemy() {
    this.srcX = 0;
    this.srcY = 644;
    this.width = 97;
    this.height = 51;
    this.speed = 10;
    this.drawX = Math.floor(Math.random() * 1e3) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight) - this.height;
    this.rewardPoints = 5;//分数在这里
}
//敌人描画
Enemy.prototype.draw = function () {
    this.drawX -= this.speed;
    contextEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkEscaped();
};
//敌人是否在画面外
Enemy.prototype.checkEscaped = function () {
    if (this.drawX + this.width <= 0) {
        this.recycleEnemy();
    }
};
//在画面外的敌人重新设置坐标
Enemy.prototype.recycleEnemy = function () {
    this.drawX = Math.floor(Math.random() * 1e3) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight);
};
function clearContextEnemy() {
    contextEnemy.clearRect(0, 0, gameWidth, gameHeight);
}
//敌人情报2
function Enemy2() {
    this.srcX = 720;
    this.srcY = 620;
    this.width = 97;
    this.height = 60;
    this.speed = 7;
    this.drawX = Math.floor(Math.random() * 1e3) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight) - this.height;
    this.rewardPoints = 10;//分数在这里
}
//敌人描画2
Enemy2.prototype.draw = function () {
    this.drawX -= this.speed;
    contextEnemy2.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkEscaped();
};
//敌人是否在画面外2
Enemy2.prototype.checkEscaped = function () {
    if (this.drawX + this.width <= 0) {
        this.recycleEnemy();
    }
};
//在画面外的敌人重新设置坐标2
Enemy2.prototype.recycleEnemy = function () {
    this.drawX = Math.floor(Math.random() * 1e3) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight);
};
function clearContextEnemy2() {
    contextEnemy2.clearRect(0, 0, gameWidth, gameHeight);
}
function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}
Button.prototype.checkClicked = function () {
    return this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom;
};
//鼠标click
function mouseClicked(e) {
    mouseX = e.pageX - canvasBg.offsetLeft;
    mouseY = e.pageY - canvasBg.offsetTop;
    if (!isPlaying)
        if (btnPlay.checkClicked())
            playGame();
}
//键盘input
function checkKeyDown(e) {
    var keyId = e.keyCode || e.which;
    if (keyId == 38 || keyId == 87) {
        jet1.isUpKey = true;
        e.preventDefault();
    }
    if (keyId == 39 || keyId == 68) {
        jet1.isRightKey = true;
        e.preventDefault();
    }
    if (keyId == 40 || keyId == 83) {
        jet1.isDownKey = true;
        e.preventDefault();
    }
    if (keyId == 37 || keyId == 65) {
        jet1.isLeftKey = true;
        e.preventDefault();
    }
    if (keyId == 32) {
        jet1.isSpaceBar = true;
        e.preventDefault();
    }
}
//键盘input
function checkKeyUp(e) {
    var keyId = e.keyCode || e.which;
    if (keyId == 38 || keyId == 87) {
        jet1.isUpKey = false;
        e.preventDefault();
    }
    if (keyId == 39 || keyId == 68) {
        jet1.isRightKey = false;
        e.preventDefault();
    }
    if (keyId == 40 || keyId == 83) {
        jet1.isDownKey = false;
        e.preventDefault();
    }
    if (keyId == 37 || keyId == 65) {
        jet1.isLeftKey = false;
        e.preventDefault();
    }
    if (keyId == 32) {
        jet1.isSpaceBar = false;
        e.preventDefault();
    }
}



