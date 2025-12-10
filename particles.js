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
let pippoplus;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  // canvas particelle
  canvas.width = width;
  canvas.height = height;

}
resize();
window.addEventListener("resize", resize);

// ---- MOUSE --------------------------------------------------------
const mouse = { x: 0, y: 0};
const prevMouse = { x: 0, y: 0};
let mouseOnScreen = false;
window.addEventListener("mousemove", onMouseMove);

function onMouseMove(e) {
  mouse.x = e.x;
  mouse.y = e.y;
  if(prevMouse.x != mouse.x && prevMouse.y != mouse.y){
    prevMouse.x = mouse.x;
    prevMouse.y = mouse.y;
    mouseOnScreen = true;
  }
  else{
     mouseOnScreen = false;
  }
};



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
const maxRadius = 4;
const minRadius = 1;
const lineWidth = 1;
const strength = 0.0002; // forza piccola
const particlesColor = "black";
const bgColor = "#3b3b3d";



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
    
    const minDx = 330; // soglia minima
    const minDy = 330; // soglia minima

    
    const dx = mouse.x - this.pos.x;
    const dy = mouse.y - this.pos.y;
    
    // applica la gravità solo se dx < minDx
    if (Math.abs(dx) < minDx &&
        Math.abs(dy) < minDy &&
        mouseOnScreen) {
      this.vel.x += dx * strength;
      this.vel.y += dy * strength;

        // log per debug
    console.log(`Gravità applicata: dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}, velX=${this.vel.x.toFixed(2)}, velY=${this.vel.y.toFixed(2)}`);
    console.log("mouse: " + mouse.x + ", " + mouse.y); 
    }
    console.log("ON/off: " + mouseOnScreen);
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
  

  
  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = lineWidth;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = particlesColor; // tutti neri
    context.fill();
    context.strokeStyle = particlesColor; // bordo nero
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
  context.fillStyle = bgColor;
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
        context.strokeStyle = particlesColor;
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



