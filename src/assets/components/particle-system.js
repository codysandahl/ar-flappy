/**
 * Basic particle system
 */
 AFRAME.registerComponent('particle-system', {
  schema: {
    gravity: { type: 'number', default: 0.03 },
    minSpeed: { type: 'number', default: -20 },
    numParticles: { type: 'int', default: 5 },
    particleSize: { type: 'vec3', default: {x: 0.1, y: 0.1, z: 0.1} },
    particleLifeSpan: { type: 'int', default: 2000 },
    color: { type: 'string', default: '#ff0000' },
    velocityMin: { type: 'vec3', default: {x: -1, y: -1, z: -1 } },
    velocityMax: { type: 'vec3', default: {x: 1, y: 1, z: 1} },
    preset: { type: 'string', default: '' }
  },

  init: function () {
    const scene = this.el.sceneEl;
    // events
    this.el.addEventListener('particleDead', this.handleParticleDeath.bind(this));
    // presets
    if (this.data.preset == 'hurt') {
      this.data.gravity = 0;
      this.data.numParticles = 20;
      this.data.particleSize = {x: 0.1, y: 0.1, z: 0.1};
      this.data.velocityMin = {x: -1, y: -1, z: 0};
      this.data.velocityMax = {x: 1, y: 1, z: 0};
      this.data.particleLifeSpan = 1000;
    }
    // create particles
    this.particles = [];
    this.numParticlesAlive = 0;
    for (let i=0; i<this.data.numParticles; i++) {
      let box = document.createElement('a-box');
      box.setAttribute('width', this.data.particleSize.x);
      box.setAttribute('height', this.data.particleSize.y);
      box.setAttribute('depth',this.data.particleSize.z);
      box.setAttribute('color', this.data.color);
      let rangeX = this.data.velocityMax.x - this.data.velocityMin.x;
      let velocityX = (Math.random() * rangeX) + this.data.velocityMin.x;
      let rangeY = this.data.velocityMax.y - this.data.velocityMin.y;
      let velocityY = (Math.random() * rangeY) + this.data.velocityMin.y;
      let rangeZ = this.data.velocityMax.z - this.data.velocityMin.z;
      let velocityZ = (Math.random() * rangeZ) + this.data.velocityMin.z;
      box.setAttribute('particle', 'velocity: '+velocityX+' '+velocityY+' '+velocityZ+'; gravity: '+this.data.gravity+'; minSpeed: '+this.data.minSpeed+'; lifeSpan: '+this.data.particleLifeSpan+';');
      this.particles.push(this.el.appendChild(box));
      this.numParticlesAlive++;
    }
  },

  handleParticleDeath: function(event) {
    this.numParticlesAlive--;
    if (this.numParticlesAlive <= 0) {
      this.el.parentNode.removeChild(this.el);
    }
  }
});

/**
 * A single particle in the system
 */
AFRAME.registerComponent('particle', {
  schema: {
    velocity: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    gravity: { type: 'number', default: 0.01 },
    minSpeed: { type: 'number', default: -20 },
    lifeSpan: { type: 'number', default: 3000 }
  },

  init: function () {
    this.velocity = this.data.velocity;
    this.life = this.data.lifeSpan;
  },

  tick: function(time, timeDelta) {
    // update position
    let velocity = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
    velocity.multiplyScalar(timeDelta*0.001);
    this.el.object3D.position.add(velocity);
    // handle gravity
    this.velocity.y -= this.data.gravity;
    if (this.velocity.y < this.data.maxFall) {
      this.velocity.y = this.data.maxFall;
    }
    // check lifespan
    this.life -= timeDelta;
    if (this.life <= 0) {
      this.el.emit('particleDead', {particleEl: this.el}, true);
      this.el.parentNode.removeChild(this.el);
    }
  },
});
