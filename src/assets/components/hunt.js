/**
 * Hunt down a target
 */
AFRAME.registerComponent('hunt', {
  schema: {
    target: { type: 'selector' },
    speed: { type: 'number', default: 1 },
  },

  init: function() {
    this.direction = new THREE.Vector3();
  },

  tick: function(time, timeDelta) {
    // target found and visible?
    if (!this.data.target || !this.data.target.getAttribute("visible") || !this.el.getAttribute("visible")) {
      this.el.setAttribute("animation-mixer", "clip: none"); // no animation (NOTE: could have idle animation instead
      return;
    }
    // grab position vectors
    var direction = this.direction;
    var targetPos = this.data.target.object3D.position;
    var currentPos = this.el.object3D.position;
    // get direction between this and target
    direction.copy(targetPos).sub(currentPos);
    // calculate distance
    var distance = direction.length();
    // look at target
    this.el.object3D.lookAt(targetPos);
    // already there?
    if (distance < 1) {
      this.el.setAttribute("animation-mixer", "clip: none"); // no animation (NOTE: could have idle animation instead)
      return;
    }
    this.el.setAttribute("animation-mixer", "clip: *"); // start animating (NOTE: could have specific walk/run animation instead)
    // scale direction's magnitude down to our max speed based on timeDelta
    var factor = this.data.speed / distance;
    ['x', 'y', 'z'].forEach(function(axis) {
      direction[axis] *= factor * (timeDelta * 0.001);
    });
    // translate toward target
    this.el.setAttribute('position', {
      x: currentPos.x + direction.x,
      y: currentPos.y + direction.y,
      z: currentPos.z + direction.z
    });
  }
});
