/**
 * A platform that moves closer toward the player at a constant rate
 */
AFRAME.registerComponent('moving-platform', {
  schema: {
    speed: { type: 'number', default: 4 },
    maxZ: { type: 'number', default: -12 }
  },

  init: function() {
    this.direction = new THREE.Vector3(0, 0, 1);
  },

  tick: function(time, timeDelta) {
    let direction = new THREE.Vector3();
    direction.copy(this.direction);
    // scale movement by time
    direction.multiplyScalar(this.data.speed*timeDelta*0.001);
    // translate toward target
    this.el.object3D.position.add(direction);
    // need to disappear?
    if (this.el.object3D.position.z >= this.data.maxZ) {
      this.el.parentNode.removeChild(this.el);
      this.el.destroy();
    }
  }
});
