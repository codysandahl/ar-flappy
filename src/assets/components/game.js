/**
 * Hunt down a target
 */
 AFRAME.registerComponent('game', {
  schema: {
    debug: { type: 'boolean', default: false },
  },

  init: function() {
    // initial debug?
    this.debug = false;
    if (this.data.debug) this.toggleDebug();
    // listen for iframe events
    window.addEventListener('message', this.onMessage.bind(this));
    // listen for game events
    this.el.addEventListener('platformDone', this.onPlatformDone.bind(this));
    this.el.addEventListener('playerDied', this.onPlayerDied.bind(this));
    // game state setup
    this.score = 0;
    this.running = true;
  },

  toggleDebug: function() {
    const sceneEl = this.el.sceneEl;
    this.debug = !this.debug; // toggle current value
    let entities = sceneEl.querySelectorAll('*');
    if (this.debug) {
      sceneEl.setAttribute("stats", "");
      for (let i=0; i<entities.length; i++) {
        if (entities[i].getAttribute('aabb-collider')) {
          entities[i].addState('debug');
        }
      }
    } else {
      sceneEl.removeAttribute("stats");
      for (let i=0; i<entities.length; i++) {
        if (entities[i].getAttribute('aabb-collider')) {
          entities[i].removeState('debug');
        }
      }
    }
  },

  toggleRunning: function() {
    this.running = !this.running;
    const sceneEl = this.el.sceneEl;
    const els = sceneEl.querySelectorAll('*'); // get all entities
    for (let i=0; i < els.length; i++) {
      if (this.running && els[i].play) {
        els[i].play();
      } else if (!this.running && els[i].pause) {
        els[i].pause();
      }
    }
  },

  onMessage: function(event) {
    // protect against cross-origin attack
    const trustedOrigins = ["http://localhost:8100", "https://ar-flappy.web.app"];
    if (!trustedOrigins.includes(event.origin)) {
      console.log("UNTRUSTED EVENT FROM", event.origin);
      return;
    }
    // handle the event
    //console.log('message', event);
    const data = event.data;
    if (data.type == 'debug') {
      this.toggleDebug();
    } else if (data.type == 'pause') {
      this.toggleRunning();
    } else if (data.type == 'start') {
      this.startGame();
    }
  },

  startGame: function() {
    // make the player visible
    this.player = document.querySelector('#dragon');
    this.player.setAttribute('visible', 'true');
    // show the helper grids
    let grids = document.querySelectorAll('.grid');
    for (let i=0; i<grids.length; i++) {
      grids[i].setAttribute('2d-grid', {visible: true});
    }
    // create the platforms
    this.platformGenerator = document.querySelector('#platformGenerator');
    this.platformGenerator.addState('running');
  },

  onPlatformDone: function(event) {
    // update score
    this.score += 10;
    // send message to ionic to display score
    parent.postMessage({type: 'updateScore', score: this.score});
  },

  onPlayerDied: function(event) {
    this.toggleRunning();
    // send message to ionic
    parent.postMessage({type: 'playerDied'});
  }
});
