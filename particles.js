// ---- UTILS -----------------------------------------------------

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}

// ---- CANVAS SETUP -----------------------------------------------

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ---- AUDIO -------------------------------------------------------

const audio = new Audio("./audio/vq.mp3");
audio.autoplay = true;
audio.loop = true;
audio.play();

// play/pause audio on click
window.addEventListener("mouseup", () => {
  audio.paused ? audio.play() : audio.pause();
});

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

const lineWidth = 4;

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.radius = randomRange(4, 12);
    this.vel = new Vector(randomRange(-1, 1), randomRange(-1, 1));
  }

  bounce(width, height) {
    if (this.pos.x <= this.radius + lineWidth || this.pos.x >= width - this.radius - lineWidth) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= this.radius + lineWidth || this.pos.y >= height - this.radius - lineWidth) {
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
    context.fill();
    context.stroke();
    context.restore();
  }
}

// ---- SKETCH -------------------------------------------------------

const agents = [];
const num = 30;

for (let i = 0; i < num; i++) {
  agents.push(new Agent(randomRange(0, width), randomRange(0, height)));
}

function sketch() {
  context.fillStyle = "red";
  context.fillRect(0, 0, width, height);

  const minDist = 250;

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    for (let j = i + 1; j < agents.length; j++) {
      const other = agents[j];
      const dist = agent.pos.getDistance(other.pos);

      if (dist < minDist) {
        context.lineWidth = mapRange(dist, 0, minDist, 10, 0);
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }
  }

  agents.forEach(a => {
    a.update();
    a.bounce(width, height);
    a.draw(context);
  });

  requestAnimationFrame(sketch);
}

sketch();
