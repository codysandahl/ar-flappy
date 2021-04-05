## Include NPM package in front-end Angular/HTML file

#### Inside /angular.json

- Find "scripts" section of JSON file
- Add the script

```
{
  "input": "node_modules/three/build/three.min.js",
  "bundleName": "three",
  "inject": false
},
```

  - NOTE: inject determines if it is automatically included in the ```<body>``` of every HTML file. If it is ```false```, you will have to manually import it in the ```<head>``` tag of the desired HTML file.
- Import the library in the ```<head>``` tag of the desired HTML file.

```
<script src="/three.js"></script>
```

## Angular and Ionic Tricks
- Update iframe inside ionic
  - document.getElementById('ID_OF_IFRAME').src += ''; // triggers reload
- Send message between container and iframe
  - document.getElementById('ID_OF_IFRAME').contentWindow.postMessage();
  - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  - https://dev.to/lvidakovic/communicating-with-an-iframe-postmessage-bare-bones-example-3p6p
- Access DOM or child elements from Angular component
  - https://www.digitalocean.com/community/tutorials/angular-viewchild-access-component
  - https://stackoverflow.com/questions/53605978/get-iframe-img-in-angular-6