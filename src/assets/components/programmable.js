/**
 * An entity that can be programmed
 */
AFRAME.registerComponent('programmable', {
  schema: {
    moveX: { type: 'number', default: 1.0 }, // amount to move left/right
    moveY: { type: 'number', default: 1.0 }, // amount to move up/down
  },

  init: function() {
    this.program = [];
    this.el.addEventListener('program', this.handleProgram.bind(this));
  },

  destroy: function() {
    this.el.removeEventListener('program', this.handleProgram.bind(this));
  },

  handleProgram: function(event) {
    let instruction = event.detail.type;
    console.log("PROGRAM", instruction);
    switch (instruction) {
      case 'trash':
        this.program = [];
        return;

      case 'go':
        this.runProgram();
        return;

      default:
        this.program.push(instruction);
        console.log(this.program);
        return;
    }
  },

  runProgram: function() {
    console.log("RUN PROGRAM", this.program);
    const el = this.el;
    let pos = el.object3D.position.clone();
    const dur = 500; // duration in ms of each animation
    const spacing = 100; // ms between animations
    for (let i=0; i<this.program.length; i++) {
      let instruction = this.program[i];
      let anim = 'property: position; from: '+pos.x+' '+pos.y+' '+pos.z+'; dur: '+dur+'; ';
      if (i > 0) {
        anim += 'delay: '+(i*(dur+spacing))+'; ';
      }
      switch (instruction) {
        case 'left':
          pos.x -= this.data.moveX;
          break;

        case 'right':
          pos.x += this.data.moveX;
          break;

        case 'up':
          pos.y += this.data.moveY;
          break;

        case 'down':
          pos.y -= this.data.moveY;
          break;

        default:
          console.log("UNKNOWN INSTRUCTION", instruction);
          break;
      }
      anim += 'to: '+pos.x+' '+pos.y+' '+pos.z+';';
      el.setAttribute('animation__'+i, anim);
    }
    // clear out program
    this.program = [];
  }
});
