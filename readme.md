# Augmented Reality Sandbox

This is an [Ionic](https://ionicframework.com/) app that integrates [AR.js](https://ar-js-org.github.io/AR.js-Docs/) and [A-Frame](https://aframe.io/) to experiment with augmented reality via a webcam in a browser or mobile device.

## Getting Started

1. Download the repository
2. Install dependencies

    ```npm install```
3. If you are having trouble with Ionic, see https://ionicframework.com/getting-started
4. Start the app

    ```ionic serve```
5. Images of the barcode tags are [here](reference/barcodes/) or get more on [GitHub](https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection)

## Demo Pages

- AR Demo ([src](src/app/ar-demo/) and [html](src/assets/ar-demo-scene.html))
  - Basic marker tracking with 3D model
  - Demonstrate overlay button in Ionic
- AR Multiple Markers ([src](src/app/ar-multiple-markers/) and [html](src/assets/ar-multiple-markers.html))
  - Barcode markers
  - Animated model
- AR Custom Models ([src](src/app/ar-custom-models/) and [html](src/assets/ar-custom-models.html))
  - Loading GLTF model from the Internet
  - Using animated GLTF model from Blender
- AR Animated Tracking ([src](src/app/ar-tracking-anim/) and [html](src/assets/ar-tracking-anim.html))
  - Custom component to keep the model on screen instead of disappearing when the marker disappears
  - Custom component to have one model hunt another model when released from its marker
  - Ability to have more than one of the same model at the same time

