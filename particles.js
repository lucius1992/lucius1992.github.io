// ---- UTILS -----------------------------------------------------

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}

// ---- CANVAS SETUP -----------//-----------------------------------


// ---- canvas particelle ----
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  // canvas particelle
  canvas.width = width;
  canvas.height = height;

  // canvas vetro
  glassCanvas.width = width;
  glassCanvas.height = height;  
}
resize();
window.addEventListener("resize", resize);


// ---- VECTOR ------------------------------------------------------

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// ---- AGENT -------------------------------------------------------
const maxRadius = 3;
const minRadius = 0.5;
const lineWidth = 0.2;

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.radius = randomRange(minRadius, maxRadius);
    this.vel = new Vector(randomRange(-1, 1), randomRange(-1, 1));
  }

bounce(width, height) { 
  if ((this.pos.x <= this.radius + lineWidth || 
      this.pos.x >= width - this.radius - lineWidth) && this.pos.x < width)
  { 
    this.vel.x *= -1; 
  } 
  if ((this.pos.y <= this.radius + lineWidth || 
      this.pos.y >= height - this.radius - lineWidth)  && this.pos.y < height)
  { 
    this.vel.y *= -1; 
  } 
}

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = lineWidth;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = "black"; // tutti neri
    context.fill();
    context.strokeStyle = "black"; // bordo nero
    context.stroke();
    context.restore();
  }
}

// ---- SKETCH -------------------------------------------------------

const agents = [];
const num = 33;


for (let i = 0; i < num; i++) {
  agents.push(new Agent(randomRange(0, width), randomRange(0, height)));
}

function sketch() {
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  const minDist = 330;

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    let closestDist = minDist; // distanza minima per mappare il raggio

    for (let j = 0; j < agents.length; j++) {
      if (i === j) continue;
      const other = agents[j];
      const dist = agent.pos.getDistance(other.pos);
      
      if (dist < closestDist) {
        closestDist = dist;
      }

      // linee tra agenti
      if (dist < minDist) {
        context.lineWidth = mapRange(dist, 0, minDist, 2, 0); // linee più sottili per distanze maggiori
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle = "black";
        context.stroke();
      }
    }

    // mappa la dimensione del pallino in base alla distanza più vicina
    agent.radius = mapRange(closestDist, 0, minDist, maxRadius, minRadius); // più vicino → più grande
  }

  agents.forEach(a => {
    a.update();
    a.bounce(width, height);
    a.draw(context);
  }); 

  requestAnimationFrame(sketch);
}

sketch();



