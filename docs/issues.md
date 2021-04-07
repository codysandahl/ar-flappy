# Issue Tracker

- Add visual frame to show the tracker boundary
  - https://threejs.org/docs/?q=line#manual/en/introduction/Drawing-lines
- Handle collisions via OBB (oriented bounding box) with diagonal platforms since AABB becomes distorted and useless in that case
  - https://stackoverflow.com/questions/28499800/oriented-box-intersection-in-threejs
  - https://github.com/schteppe/cannon.js
- Have death animation for player
- Check all eventListeners are removed when objects are destroyed
- Make tracker movement LERP instead of jumping around
- To start game, move tag to a designated zone to make sure it's working OR offer mouse/touch fallback mode