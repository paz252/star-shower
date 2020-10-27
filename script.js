//Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

//Utility functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


//Objects
function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 16,
        y: 3
    }
    this.gravity = 5;
    this.friction = 0.8;
}

Star.prototype.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.shadowColor = '#E3EAEF';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
}

Star.prototype.update = function () {
    this.draw();

    //When star hits bottom of screen
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.shatter();
    } else {
        this.velocity.y += this.gravity;
    }

    //When star hits side of screen
    if(this.x + this.radius + this.velocity.x > canvas.width ||
        this.x - this.radius <= 0){
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

Star.prototype.shatter = function () {
    this.radius -= 3;
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2));
    }
}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color);
    this.velocity = {
        x: randomIntFromRange(-5, 5),
        y: randomIntFromRange(-10, 10)
    }
    this.gravity = 0.2;
    this.friction = 0.8;
    this.ttl = 300;   ///ttl-time to live- 100 frames
    this.opacity = 1;
}

MiniStar.prototype.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = `rgba(227,234,239,${this.opacity})`;
    c.shadowColor = '#E3EAEF';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
}

MiniStar.prototype.update = function () {
    this.draw();

    //When star hits bottom of screen
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
    } else {
        this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 1 / this.ttl;
}

function createMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount;
        c.beginPath();
        c.moveTo(i * mountainWidth, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        c.lineTo(i * mountainWidth - 325, canvas.height);
        c.fillStyle = color;
        c.fill();
        c.closePath();
    }
}

//Implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
const groundHeight = 50;

function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    // for (let i = 0; i < 1; i++) {
    //     stars.push(new Star(canvas.width / 2, 30, 30, '#E3EAEF'));
    // }

    for(let i=0;i<150;i++){
        const x = Math.random() * canvas.width; 
        const y = Math.random() * canvas.height; 
        const radius = Math.random() * 3; 
        backgroundStars.push(new Star(x,y,radius,'white'));
    }
}

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = backgroundGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    backgroundStars.forEach(backgroundStar=>{
        backgroundStar.draw();
    });

    createMountainRange(1, canvas.height - 50, '#384551');
    createMountainRange(2, canvas.height - 100, '#2B3843');
    createMountainRange(3, canvas.height - 280, '#26333E');
    c.fillStyle = '#182028';
    c.fillRect(0,canvas.height - groundHeight,canvas.width,groundHeight);

    stars.forEach((star, index) => {
        star.update();
        if (star.radius == 0) {
            stars.splice(index, 1);
        }
    });

    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStar.ttl == 0) {
            miniStars.splice(index, 1);
        }
    });

    ticker++;
    
    if(ticker % randomSpawnRate == 0){
        const radius = 12;
        const x = Math.max(12,Math.random() * canvas.width - radius);
        stars.push(new Star(x,-100,radius,'#E3EAEF'));
        randomSpawnRate = randomIntFromRange(50,200);
    }
}

init();
animate();
