/**
 * A marker that can be used to program the dragon's movement by moving it into the programming region of the screen
 * NOTE: A marker must be removed from the area to be able to be programmed again
 */
AFRAME.registerComponent('programmer', {
  schema: {
    minArea: { type: 'vec3', default: {x: -2, y: -1, z: -15} },
    maxArea: { type: 'vec3', default: {x: 2, y: 1, z: -8} },
    type: { type: 'string', default: 'test' },
  },

  init: function() {
    this.isProgrammable = true;
    this.programArea = new THREE.Box3(this.data.minArea, this.data.maxArea);
  },

  update: function(oldData) {
    if (!this.el.object3D.visible && !this.isProgrammable) {
      this.isProgrammable = true;
    }
  },

  tick: function(time, timeDelta) {
    // check for collision with isProgrammable area
    const pos = this.el.object3D.position;
    //console.log(this.data.type, pos, this.isProgrammable, this.programArea.containsPoint(pos));
    if (this.programArea.containsPoint(pos)) {
      if (this.isProgrammable) {
        //console.log("PROGRAM", this.data.type);
        this.isProgrammable = false;
        this.el.emit('program', {type: this.data.type});
      }
    } else if (!this.isProgrammable) {
      this.isProgrammable = true; // reset programmability after leaving the program area
    }
  }
});
