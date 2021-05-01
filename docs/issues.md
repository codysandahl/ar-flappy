# Issue Tracker

- Handle collisions via OBB (oriented bounding box) with diagonal platforms since AABB is useless in that case
  - https://stackoverflow.com/questions/28499800/oriented-box-intersection-in-threejs
  - https://github.com/schteppe/cannon.js
- Have death animation for player
- Check all eventListeners are removed when objects are destroyed to prevent memory leaks
- Current lerp component works with position but not rotation and scaling yet
- To start game, move tag to a designated zone to make sure it's working OR offer mouse/touch fallback mode
- Disable programming before hitting start game
- Start player in exact middle so they don't hit blocks above/below at start
- Adjust programmable component so the default moveX and moveY aligns with the grid spacing
- Allow swapping between front/rear facing cameras
- When using rear facing camera, don't use mirroring of webcam feed
- Lower threshold for detecting a marker? It's pretty spotty right now
- Periodic mode should pause after hitting platform AND after dodging platform
- Have landscape and portrait interfaces
  - Programming icons would go on side or bottom depending on orientation
- Add menu buttons to get back to choose live/periodic

# Feature Requests

- Create a bulk programming mode
  - Use 2 live tags to determine programming area
  - Capture screenshot when those 2 tags are visible and tracking
  - Use ARToolkit to process the programming from that screenshot
    - SEE https://github.com/AR-js-org/AR.js/blob/master/three.js/vendor/jsartoolkit5/js/artoolkit.api.js
  - Programming the dragon to fly through whole levels
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