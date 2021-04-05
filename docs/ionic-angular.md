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
