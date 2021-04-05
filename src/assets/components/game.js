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
    // game state setup
    this.score = 0;
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
    }
  },

  onPlatformDone: function(event) {
    // update score
    this.score += 10;
    // send message to ionic to display score
    parent.postMessage({type: 'updateScore', score: this.score});
  }
});
