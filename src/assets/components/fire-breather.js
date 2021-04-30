/**
 * Breathe fire when the given marker appears
 * NOTE: to throttle, see https://aframe.io/docs/1.2.0/core/utils.html#aframe-utils-throttletick-function-t-dt-minimuminterval-optionalcontext
 */
AFRAME.registerComponent('fire-breather', {
  schema: {
    marker: { type: 'selector' }, // the CSS ID of the entity to track (ex: #dragonMarker, #dragon, etc)
    positionOffset: { type: 'vec3', default: {x: 0, y: 0, z: 0} },
    cooldown: { type: 'int', default: 2000 }, // ms between uses of this power
  },

  init: function () {
    this.cooldownTimer = 0;
  },

  tick: function(time, timeDelta) {
    // cooling down?
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= timeDelta;
      return;
    }
    // found the marker to track?
    if (this.data.marker.getAttribute("visible")) {
      // start cooldown
      this.cooldownTimer = this.data.cooldown;
      // create the fire
      const el = this.el;
      const sceneEl = el.sceneEl;
      let fx = document.createElement('a-entity');
      let position = el.object3D.position.clone();
      position.add(this.data.positionOffset);
      fx.setAttribute('position', position);
      fx.setAttribute('particle-system', 'preset: fire;');
      sceneEl.appendChild(fx);
    }
  },
});
