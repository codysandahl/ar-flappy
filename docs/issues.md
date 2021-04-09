# Issue Tracker

- Ionic "centered" logo, button, and "start game" are slightly off center
- Handle collisions via OBB (oriented bounding box) with diagonal platforms since AABB becomes distorted and useless in that case
  - https://stackoverflow.com/questions/28499800/oriented-box-intersection-in-threejs
  - https://github.com/schteppe/cannon.js
- Have death animation for player
- Check all eventListeners are removed when objects are destroyed
- Current lerp component works with position but not rotation and scaling yet
- To start game, move tag to a designated zone to make sure it's working OR offer mouse/touch fallback mode

# Feature Requests

- Create a periodic programming mode
  - Dragon flies through the level
  - After dodging/hitting a platform, app goes into programming mode
  - It asks what you want to do, and you put programming tags into the target area to add the instruction
  - You can add up to 5? instructions by adding one at a time (with one second pause)
  - Then you hold up the "Go" instruction or tap "Go" button to make it start
- Create a bulk programming mode
  - Use 2 live tags to determine programming area
  - Capture screenshot when those 2 tags are visible and tracking
  - Use ARToolkit to process the programming from that screenshot
    - SEE https://github.com/AR-js-org/AR.js/blob/master/three.js/vendor/jsartoolkit5/js/artoolkit.api.js
  - Programming the dragon to fly through whole levels
- Make the platforms move faster after a certain score
  - Ex: After 100 points, play sound, give celebration particle FX, and speed up platforms
- Make platforms that are like walls with only one viable hole to go through
  - Ex 1: One platform is the "root" that actually fires events like platformDone. Make the wall with a hole by adding "child" platforms that don't fire events other than collision
    - xxx
    - xxo
    - xxx
  - Ex 2: Same "root" idea as Ex 1, but make three blocks to make a diagonal and avoid using OBB collisions
    - oox
    - oxo
    - xoo
- Add powerups like temporary shield, fireball, extra points
- 