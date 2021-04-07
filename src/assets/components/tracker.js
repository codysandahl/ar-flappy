/**
 * Track a marker, but the model persists even if the marker disappears
 * NOTE: to throttle, see https://aframe.io/docs/1.2.0/core/utils.html#aframe-utils-throttletick-function-t-dt-minimuminterval-optionalcontext
 */
AFRAME.registerComponent('tracker', {
  schema: {
    marker: { type: 'selector' },
    rotation: { type: 'boolean', default: true },
    position: { type: 'boolean', default: true },
    mirror: { type: 'boolean', default: true }, /* mirror when camera is facing toward the user instead of away */
    lockZ: { type: 'boolean', default: false }, /* keep z-depth at a constant or track the marker? */
    lockZValue: { type: 'number', default: -5 }, /* z-depth to use IF lockZ is set to true */
    minX: { type: 'number', default: -4 },
    maxX: { type: 'number', default: 4 },
    minY: { type: 'number', default: -2 },
    maxY: { type: 'number', default: 2 },
  },

  init: function () {
  },

  tick: function(time, timeDelta) {
    // found the marker to track?
    if (this.data.marker.getAttribute("visible")) {
      this.el.setAttribute("visible", true);
      if (this.data.position) {
        let markerPos = this.data.marker.getAttribute('position');
        // handle mirror
        if (this.data.mirror) {
          markerPos.x *= -1;
        }
        // handle locked Z
        if (this.data.lockZ) {
          markerPos.z = this.data.lockZValue;
        }
        // handle x clamping
        if (markerPos.x < this.data.minX) markerPos.x = this.data.minX;
        if (markerPos.x > this.data.maxX) markerPos.x = this.data.maxX;
        if (markerPos.y < this.data.minY) markerPos.y = this.data.minY;
        if (markerPos.y > this.data.maxY) markerPos.y = this.data.maxY;
        // handle y clamping
        // finalize position
        this.el.setAttribute("position", markerPos);
      }
      if (this.data.rotation) {
        this.el.setAttribute("rotation", this.data.marker.getAttribute("rotation"));
      }
    }
    // no marker => idle or default actions
    else {
    }
  },
});
