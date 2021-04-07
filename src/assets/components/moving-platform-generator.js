/**
 * A platform that moves closer toward the player at a constant rate
 */
AFRAME.registerComponent('moving-platform-generator', {
  schema: {
    running: { type: 'boolean', default: true },
    speed: { type: 'number', default: 4 },
    startZ: { type: 'number', default: -30 },
    maxZ: { type: 'number', default: -12 },
    maxPlatforms: { type: 'int', default: 4 },
    spacing: { type: 'number', default: 10 },
    width: { type: 'number', default: 5 },
    height: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
  },

  init: function() {
    this.direction = new THREE.Vector3(0, 0, 1);
    // listen for game events
    this.el.addEventListener('stateadded', this.onStateAdded.bind(this));
    // create platform generators
    this.generators = [];
    this.generators.push(this.createPlatform.bind(this, 0, 0, 0, '#ff0000'));
    this.generators.push(this.createPlatform.bind(this, 0, 1.5, 0, '#00ff00'));
    this.generators.push(this.createPlatform.bind(this, 0, -1.5, 0, '#0000ff'));
    this.generators.push(this.createPlatform.bind(this, 0, 0, 90, '#ff00ff'));
    this.generators.push(this.createPlatform.bind(this, -1.5, 0, 90, '#00ffff'));
    this.generators.push(this.createPlatform.bind(this, 1.5, 0, 90, '#ffffff'));
    // create initial platforms
    this.numPlatforms = 0;
    if (this.data.running) {
      while (this.numPlatforms < this.data.maxPlatforms) {
        this.createRandomPlatform();
      }
    }
  },

  createRandomPlatform: function() {
    let i = Math.floor(Math.random()*this.generators.length);
    this.generators[i]();
  },

  createPlatform: function(x, y, rotation, color) {
    let box = document.createElement('a-box');
    // TODO: randomly select platform positions
    // TODO: randomly select color
    let z = this.data.startZ - this.numPlatforms*this.data.spacing;
    box.setAttribute('class', 'platform');
    box.setAttribute('position', x+' '+y+' '+z);
    box.setAttribute('width', this.data.width);
    box.setAttribute('height', this.data.height);
    box.setAttribute('depth', this.data.depth);
    box.setAttribute('rotation', '0 0 '+rotation);
    box.setAttribute('color', color);
    box.setAttribute('shadow', 'receive: true');
    box.setAttribute('aabb-collider', '');
    box.setAttribute('moving-platform', 'speed: '+this.data.speed+'; maxZ: '+this.data.maxZ+';');
    box.addEventListener('platformDone', this.onPlatformDone.bind(this));
    this.el.sceneEl.appendChild(box);
    this.numPlatforms++;
  },

  onPlatformDone: function(event) {
    event.target.removeEventListener('platformDone', this.onPlatformDone.bind(this));
    this.numPlatforms--;
    // create the next one
    while (this.numPlatforms < this.data.maxPlatforms) {
      this.createRandomPlatform();
    }
  },

  onStateAdded: function(event) {
    if (this.el.is('running')) {
      while (this.numPlatforms < this.data.maxPlatforms) {
        this.createRandomPlatform();
      }
    }
  },
});