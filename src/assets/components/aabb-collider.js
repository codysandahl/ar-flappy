/**
 * Based on aframe/examples/showcase/tracked-controls.
 * 
 * TODO: UPDATE FOR AABB
 *
 * Implement bounding sphere collision detection for entities with a mesh.
 * Sets the specified state on the intersected entities.
 *
 * @property {string} objects - Selector of the entities to test for collision.
 * @property {string} state - State to set on collided entities.
 *
 */
AFRAME.registerComponent('aabb-collider', {
  schema: {
    objects: { type: 'string', default: ''},
    radius: { type: 'number', default: 0.05 },
    watch: { type: 'boolean', default: true },
    box: { default: '' }
  },

  init: function () {
    /** @type {MutationObserver} */
    this.observer = null;
    /** @type {Array<Element>} Elements to watch for collisions. */
    this.els = [];
    /** @type {Array<Element>} Elements currently in collision state. */
    this.collisions = [];

    this.handleHit = this.handleHit.bind(this);
    this.handleHitEnd = this.handleHitEnd.bind(this);

    // listen for game events
    this.el.addEventListener('stateadded', this.onStateAdded.bind(this));
    this.el.addEventListener('stateremoved', this.onStateRemoved.bind(this));
  },

  onStateAdded: function(event) {
    if (event.detail === 'debug') {
      // debug => show bounding box
      if (!this.boxHelper) {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        this.boxHelper = new THREE.BoxHelper(mesh, 0xff0000);
        this.el.sceneEl.object3D.add(this.boxHelper); // add to THREE.js scene
      }
    }
  },

  onStateRemoved: function(event) {
    if (event.detail === 'debug') {
      if (this.boxHelper) {
        this.el.sceneEl.object3D.remove(this.boxHelper);
        this.boxHelper = null;
      }
    }
  },

  remove: function () {
    this.pause();
    if (this.boxHelper) {
      this.el.sceneEl.object3D.remove(this.boxHelper);
      this.boxHelper = null;
    }
  },

  play: function () {
    const sceneEl = this.el.sceneEl;

    if (this.data.watch) {
      this.observer = new MutationObserver(this.update.bind(this, null));
      this.observer.observe(sceneEl, {childList: true, subtree: true});
    }
  },

  pause: function () {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  /**
   * Update list of entities to test for collision.
   */
  update: function () {
    const data = this.data;
    let objectEls;

    // Push entities into list of els to intersect.
    if (data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
    } else {
      // If objects not defined, intersect with nothing
      objectEls = [];
    }
    //console.log('Collision Objects', objectEls);
    // Convert from NodeList to Array
    this.els = Array.prototype.slice.call(objectEls);

  },

  tick: function(time, timeDelta) {
    // setup collision AABB
    const el = this.el;
    const data = this.data;
    const mesh = el.getObject3D('mesh');
    if (!mesh) return;
    // debug => show bounding box
    if (this.boxHelper) {
      this.boxHelper.update();
    }
    // actual bounding box for collision
    if (!data.box) {
      data.box = new THREE.Box3();
    }
    data.box.setFromObject(mesh);
    // test for collisions
    if (!this.els || this.els.length <= 0) return;
    let collisions = this.els.filter(this.intersects.bind(this));
    collisions.forEach(this.handleHit.bind(this));
    // TODO: signal end of old hits
  },

  intersects: function(other) {
    if (!other.isEntity) return;
    const otherBox = AFRAME.utils.entity.getComponentProperty(other, 'aabb-collider.box');
    if (!otherBox || !this.data.box) return; // only collide with another aabb-collider
    return this.data.box.intersectsBox(otherBox);
  },

  tickOld: (function () {
    const position = new THREE.Vector3(),
        meshPosition = new THREE.Vector3(),
        colliderScale = new THREE.Vector3(),
        size = new THREE.Vector3(),
        box = new THREE.Box3(),
        distanceMap = new Map();
    return function () {
      const el = this.el,
          data = this.data,
          mesh = el.getObject3D('mesh'),
          collisions = [];
      let colliderRadius;

      if (!mesh) { return; }

      distanceMap.clear();
      el.object3D.getWorldPosition(position);
      el.object3D.getWorldScale(colliderScale);
      colliderRadius = data.radius * scaleFactor(colliderScale);
      // Update collision list.
      this.els.forEach(intersect);

      // Emit events and add collision states, in order of distance.
      collisions
        .sort((a, b) => distanceMap.get(a) > distanceMap.get(b) ? 1 : -1)
        .forEach(this.handleHit);

      // Remove collision state from current element.
      if (collisions.length === 0) { el.emit('hit', {el: null}); }

      // Remove collision state from other elements.
      this.collisions
        .filter((el) => !distanceMap.has(el))
        .forEach(this.handleHitEnd);

      // Store new collisions
      this.collisions = collisions;

      // Bounding sphere collision detection
      function intersect (el) {
        let radius, mesh, distance, extent;

        if (!el.isEntity) { return; }

        mesh = el.getObject3D('mesh');

        if (!mesh) { return; }

        box.setFromObject(mesh).getSize(size);
        extent = Math.max(size.x, size.y, size.z) / 2;
        radius = Math.sqrt(2 * extent * extent);
        box.getCenter(meshPosition);

        if (!radius) { return; }

        distance = position.distanceTo(meshPosition);
        if (distance < radius + colliderRadius) {
          collisions.push(el);
          distanceMap.set(el, distance);
        }
      }
      // use max of scale factors to maintain bounding sphere collision
      function scaleFactor (scaleVec) {
        return Math.max.apply(null, scaleVec.toArray());
      }
    };
  })(),

  handleHit: function (targetEl) {
    targetEl.emit('hit');
    targetEl.addState(this.data.state);
    //console.log('hit', targetEl);
    this.el.emit('hit', {el: targetEl});
  },
  handleHitEnd: function (targetEl) {
    targetEl.emit('hitend');
    targetEl.removeState(this.data.state);
    this.el.emit('hitend', {el: targetEl});
  }
});
