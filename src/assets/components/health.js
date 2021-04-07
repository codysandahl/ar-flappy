/**
 * Track and display health
 */
AFRAME.registerComponent('health', {
  schema: {
    positionOffset: { type: 'vec3', default: {x:0, y:-.4, z:0} },
    maxHealth: { type: 'int', default: 2 },
    displayHealthBar: { type: 'boolean', default: true },
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 0.1 },
    depth: { type: 'number', default: 0.01 },
    healthColor: { default: '#ff0000' },
    bgColor: { default: '#333333' },
    bgFrameSize: { type: 'number', default: 0.01 },
    visible: { type: 'boolean', default: true },
  },

  init: function () {
    // listen to game events
    this.el.addEventListener('hit', this.collisionHandler.bind(this));
    this.el.addEventListener('componentchanged', this.onVisible.bind(this));
    // create health bar
    this.health = this.data.maxHealth;
    if (this.data.displayHealthBar) {
      this.createHealthBar();
    }
  },

  createHealthBar: function() {
    const el = this.el;
    let position = el.object3D.position.clone();
    position.x += this.data.positionOffset.x;
    position.y += this.data.positionOffset.y;
    position.z += this.data.positionOffset.z;
    // create the background
    let bg = document.createElement('a-box');
    this.bg = bg;
    el.sceneEl.appendChild(bg);
    bg.object3D.position.copy(position);
    bg.setAttribute('color', this.data.bgColor);
    bg.setAttribute('width', this.data.width+this.data.bgFrameSize);
    bg.setAttribute('height', this.data.height+this.data.bgFrameSize);
    bg.setAttribute('depth', this.data.depth+this.data.bgFrameSize);
    // create the healthbar
    let healthBar = document.createElement('a-box');
    this.healthBar = healthBar;
    el.sceneEl.appendChild(healthBar);
    healthBar.object3D.position.copy(position);
    healthBar.setAttribute('color', this.data.healthColor);
    healthBar.setAttribute('width', this.data.width);
    healthBar.setAttribute('height', this.data.height);
    healthBar.setAttribute('depth', this.data.depth);
    // visible?
    if (!this.data.visible) {
      bg.setAttribute('visible', false);
      healthBar.setAttribute('visible', false);
    }
  },

  destroy: function() {
    if (this.healthBar) {
      this.healthBar.parentNode.removeChild(this.healthBar);
      this.healthBar = null;
    }
    if (this.bg) {
      this.bg.parentNode.removeChild(this.bg);
      this.bg = null;
    }
    this.el.removeEventListener('hit', this.collisionHandler.bind(this));
    this.el.removeEventListener('componentchanged', this.onVisible.bind(this));
  },

  tick: function(time, timeDelta) {
    if (!this.healthBar || !this.bg) return;
    // move health bar and bg with entity
    const el = this.el;
    let position = el.object3D.position.clone();
    position.x += this.data.positionOffset.x;
    position.y += this.data.positionOffset.y;
    position.z += this.data.positionOffset.z;
    this.healthBar.object3D.position.copy(position);
    this.bg.object3D.position.copy(position);
  },

  updateHealthBar: function() {
    if (!this.healthBar) return;
    this.healthBar.setAttribute('width', this.data.width * (this.health / this.data.maxHealth));
  },

  collisionHandler(event) {
    if (!this.el || !this.el.getAttribute("visible")) return;
    const el = this.el;
    const sceneEl = el.sceneEl;
    const otherEl = event.detail.el;
    //console.log('Entity collided with', otherEl, otherEl.getAttribute('position'));
    // remove platform
    let otherColor = otherEl.getAttribute('color');
    otherEl.parentNode.removeChild(otherEl);
    otherEl.destroy();
    // show damage
    let fx = document.createElement('a-entity');
    fx.setAttribute('position', el.getAttribute('position'));
    fx.setAttribute('particle-system', 'preset: hurt;'+(otherColor ? ' color: '+otherColor+';' : ''));
    sceneEl.appendChild(fx);
    // decrease health
    this.health--;
    // update health bar
    this.updateHealthBar();
    if (this.health <= 0) {
      el.emit('playerDied', {}, true);
      this.el.parentNode.removeChild(this.el);
      this.destroy();
    }
  },

  onVisible(event) {
    if (!this.healthBar || !this.bg) return;
    if (event.detail.name === 'visible') {
      let visible = event.target.getAttribute('visible');
      this.healthBar.setAttribute('visible', visible);
      this.bg.setAttribute('visible', visible);
    }
  }
});
