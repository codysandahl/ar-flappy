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
    if (this.debug) {
      sceneEl.setAttribute("stats", "");
    } else {
      sceneEl.removeAttribute("stats");
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
    const trustedOrigins = ["http://localhost:8100"];
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
    }
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
