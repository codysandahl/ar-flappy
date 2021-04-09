/**
 * LERP component originally from https://github.com/haydenjameslee/aframe-lerp-component
 * Modified by Cody Sandahl
 */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

let degToRad = THREE.Math.degToRad;

/**
 * Linear Interpolation component for A-Frame.
 */
AFRAME.registerComponent('lerp', {
  schema: {
    lerpPosition: { type: 'boolean', default: true },
    position: { type: 'vec3', default: {x:0, y:0, z:0} },
    maxMove: { type: 'number', default: 10.0 }, // max movement per second
    lerpRotation: { type: 'boolean', default: true },
    rotation: { type: 'vec3', default: {x:0, y:0, z:0} },
    maxRot: { type: 'number', default: 180.0 }, // max degrees per second
    lerpScale: { type: 'boolean', default: true },
    scale: { type: 'vec3', default: {x:1, y:1, z:1} },
    maxScale: { type: 'number', default: 1.0 }, // max scale per second
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    var el = this.el;
    this.lastPosition = {};
    Object.assign(this.lastPosition, this.data.position); // need copy by value instead of reference
    this.lastRotation = {};
    Object.assign(this.lastRotation, this.data.rotation);
    this.lastScale = {};
    Object.assign(this.lastScale, this.data.scale);
    this.lerpingPosition = false;
    this.lerpingRotation = false;
    this.lerpingScale = false;
  },

  /**
   * Called on each scene tick.
   */
  tick: function (time, deltaTime) {
    let progress;
    const obj3d = this.el.object3D;
    // Lerp position
    if (!(this.areVectorsSame(this.data.position, this.lastPosition))) {
      const newPosition = new THREE.Vector3(this.data.position.x, this.data.position.y, this.data.position.z); // convert to Vector3
      this.toPosition(obj3d.position, newPosition, time, deltaTime);
      Object.assign(this.lastPosition, this.data.position);
    }
    if (this.lerpingPosition) {
      progress = (time - this.startLerpTimePosition) / this.durationPosition;
      obj3d.position.lerpVectors(this.startPosition, this.targetPosition, progress);
      //console.log("lerp position", progress, this.lastPosition);
      if (progress >= 1) {
        this.lerpingPosition = false;
      }
    }

    // Slerp rotation
    if (this.lerpingRotation) {
      progress = (now - this.startLerpTimeRotation) / this.durationRotation;
      THREE.Quaternion.slerp(this.startRotation, this.targetRotation, obj3d.quaternion, progress);
      if (progress >= 1) {
        this.lerpingRotation = false;
      }
    }

    // Lerp scale
    if (this.lerpingScale) {
      progress = (now - this.startLerpTimeScale) / this.durationScale;
      obj3d.scale.lerpVectors(this.startScale, this.targetScale, progress);
      if (progress >= 1) {
        this.lerpingScale = false;
      }
    }
  },

  /**
   * Start lerp to position (vec3)
   */
  toPosition: function(from, to, time, deltaTime) {
    this.startPosition = new THREE.Vector3(from.x, from.y, from.z);
    this.targetPosition = new THREE.Vector3(to.x, to.y, to.z);
    const dist = this.startPosition.distanceTo(this.targetPosition);
    this.durationPosition = Math.ceil(dist / this.data.maxMove * 1000); // TODO: finish rot and scale
    if (this.durationPosition > 100) {
      this.lerpingPosition = true;
      this.startLerpTimePosition = time - deltaTime; // start movement (otherwise it will stay still while moving the tag around constantly)
      //console.log("toPosition", dist, "dur", this.durationPosition);
    } else {
      // not enough to lerp => just move
      this.el.object3D.position.copy(this.targetPosition);
    }
  },

  /**
   * Start lerp to euler rotation (vec3,'YXZ')
   * TODO: update rotation to new system
   */
  toRotation: function(from, to) {
    this.lerpingRotation = true;
    this.startRotation = new THREE.Quaternion();
    this.startRotation.setFromEuler(
        new THREE.Euler(degToRad(from.x), degToRad(from.y), degToRad(from.z), 'YXZ'));
    this.targetRotation = new THREE.Quaternion();
    this.targetRotation.setFromEuler(
        new THREE.Euler(degToRad(to.x), degToRad(to.y), degToRad(to.z), 'YXZ'));
  },

  /**
   * Start lerp to scale (vec3)
   * TODO: update scale to new system
   */
  toScale: function (from, to) {
    this.lerpingScale = true;
    this.startScale = new THREE.Vector3(from.x, from.y, from.z);
    this.targetScale = new THREE.Vector3(to.x, to.y, to.z);
  },

  /**
   * Check if two vectors are the same
   * TODO: make this use a difference with epsilon to handle float errors
   */
  areVectorsSame: function(a, b) {
    return (a.x == b.x && a.y == b.y && a.z == b.z);
  }
});
