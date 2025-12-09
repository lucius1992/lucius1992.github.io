
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

// -------------------------------------
// PARTICLE CLASS
// -------------------------------------
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.size = 2 + Math.random() * 2;
    this.life = 100 + Math.random() * 100;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // bounce edges (optional)
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();
  }

  isDead() {
    return this.life <= 0;
  }
}

// -------------------------------------
// PARTICLE SYSTEM
// -------------------------------------
const particles = [];

function addParticle(x, y) {
  particles.push(new Particle(x, y));
}

// spawn iniziale
for (let i = 0; i < 200; i++) {
  addParticle(width / 2, height / 2);
}

// -------------------------------------
// LOOP DI ANIMAZIONE
// -------------------------------------
function animate() {
  context.fillStyle = "rgba(0, 0, 0, 0.2)"; // trail effect
  context.fillRect(0, 0, width, height);

  // aggiungi 1 nuovo particle ogni frame
  addParticle(width / 2, height / 2);

  particles.forEach((p, i) => {
    p.update();
    p.draw(context);

    if (p.isDead()) {
      particles.splice(i, 1);
    }
  });
  
 drawGlass();
  requestAnimationFrame(animate);
}

animate();




// ---- glass / vetro opaco con displacement noise ----
function drawGlass(){
  const imgData = glassCtx.createImageData(width,height);
  for(let i=0;i<imgData.data.length;i+=4){
    const val = Math.floor(Math.random()*50)+200; // bianco leggermente variabile
    imgData.data[i] = val;
    imgData.data[i+1] = val;
    imgData.data[i+2] = val;
    imgData.data[i+3] = 50; // trasparenza
  }
  glassCtx.putImageData(imgData,0,0);
}

