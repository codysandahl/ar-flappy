/**
 * Draw a 2d grid (or box) in 3d space
 */
AFRAME.registerComponent('2d-grid', {
  schema: {
    visible: { type: 'boolean', default: true },
    lowerLeft: { type: 'vec3', default: {x:-1, y:-1, z:-1} },
    upperRight: { type: 'vec3', default: {x:1, y:1, z:1} },
    color: { type: 'string', default: '#ffff00' },
    opacity: { type: 'number', default: 1.0 },
    verticalGridLines: { type: 'int', default: 2 }, // number of vertical grid lines to draw inside of box
    horizontalGridLines: { type: 'int', default: 2 }, // number of horizontal grid lines to draw inside of box
  },

  init: function () {
  },

  update: function(oldData) {
    if (this.data.visible && !oldData.visible) {
      this.createGrid();
    } else if (!this.data.visible && oldData.visible) {
      this.destroyGrid();
    }
  },

  destroyGrid: function() {
    if (this.grid) {
      this.grid.parent.removeChild(this.grid);
      this.grid.destroy();
      this.grid = null;
    }
  },

  createGrid: function() {
    // SEE https://aframe.io/docs/1.2.0/components/line.html
    // get rid of old grid
    this.destroyGrid();
    // calculate grid points
    const lowerLeft = this.data.lowerLeft;
    const upperRight = this.data.upperRight;
    const lowerRight = new THREE.Vector3(upperRight.x, lowerLeft.y, upperRight.z);
    const upperLeft = new THREE.Vector3(lowerLeft.x, upperRight.y, lowerLeft.z);
    // create box
    this.grid = document.createElement('a-entity');
    this.grid.setAttribute('line', 
      'start: '+this.vec3ToAttribute(lowerLeft)+'; '+
      'end: '+this.vec3ToAttribute(lowerRight)+'; '+
      'color: '+this.data.color+'; opacity: '+this.data.opacity
    );
    this.grid.setAttribute('line__2', 
    'start: '+this.vec3ToAttribute(lowerRight)+'; '+
    'end: '+this.vec3ToAttribute(upperRight)+'; '+
    'color: '+this.data.color+'; opacity: '+this.data.opacity
    );
    this.grid.setAttribute('line__3', 
    'start: '+this.vec3ToAttribute(upperRight)+'; '+
    'end: '+this.vec3ToAttribute(upperLeft)+'; '+
    'color: '+this.data.color+'; opacity: '+this.data.opacity
    );
    this.grid.setAttribute('line__4', 
    'start: '+this.vec3ToAttribute(upperLeft)+'; '+
    'end: '+this.vec3ToAttribute(lowerLeft)+'; '+
    'color: '+this.data.color+'; opacity: '+this.data.opacity
    );
    // vertical grid lines
    // TODO: this math might not be correct for squares that aren't axially-aligned
    let i;
    let lineNum = 4;
    let offsetX = (upperRight.x - upperLeft.x) / (this.data.verticalGridLines+1);
    let offsetY = (upperRight.y - upperLeft.y) / (this.data.verticalGridLines+1);
    let offsetZ = (upperRight.z - upperLeft.z) / (this.data.verticalGridLines+1);
    for (i=1; i<=this.data.verticalGridLines; i++) {
      let top = new THREE.Vector3(upperLeft.x + i*offsetX, upperLeft.y + i*offsetY, upperLeft.z + i*offsetZ);
      let btm = new THREE.Vector3(lowerLeft.x + i*offsetX, lowerLeft.y + i*offsetY, lowerLeft.z + i*offsetZ);
      this.grid.setAttribute('line__'+(lineNum+i), 
      'start: '+this.vec3ToAttribute(top)+'; '+
      'end: '+this.vec3ToAttribute(btm)+'; '+
      'color: '+this.data.color+'; opacity: '+this.data.opacity
      );
    }
    // horizontal grid lines
    // TODO: this math might not be correct for squares that aren't axially-aligned
    lineNum += this.data.verticalGridLines;
    offsetX = (lowerLeft.x - upperLeft.x) / (this.data.horizontalGridLines+1);
    offsetY = (lowerLeft.y - upperLeft.y) / (this.data.horizontalGridLines+1);
    offsetZ = (lowerLeft.z - upperLeft.z) / (this.data.horizontalGridLines+1);
    for (i=1; i<=this.data.horizontalGridLines; i++) {
      let left = new THREE.Vector3(upperLeft.x + i*offsetX, upperLeft.y + i*offsetY, upperLeft.z + i*offsetZ);
      let right = new THREE.Vector3(upperRight.x + i*offsetX, upperRight.y + i*offsetY, upperRight.z + i*offsetZ);
      this.grid.setAttribute('line__'+(lineNum+i), 
      'start: '+this.vec3ToAttribute(left)+'; '+
      'end: '+this.vec3ToAttribute(right)+'; '+
      'color: '+this.data.color+'; opacity: '+this.data.opacity
      );
    }
    // add to element
    this.el.appendChild(this.grid);
  },

  vec3ToAttribute: function(vec3) {
    return ''+vec3.x+' '+vec3.y+' '+vec3.z;
  }
});
