import * as BABYLON from '@babylonjs/core';
import { connectToRoom , sendShapeUpdate} from './colyseusClient.js'; //

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let scene = null;
let currentShape = null;

async function createScene() {
    scene = new BABYLON.Scene(engine);
    scene.createDefaultCameraOrLight(true, false, true);

    await connectToRoom();//rmeove scene
    return scene;
}

// Shape selection function, triggered by the UI buttons
window.selectShape = (shape) => {
    if (currentShape) {
        currentShape.dispose(); // Remove the previous shape
    }

    if (shape === "box") {
        currentShape = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    } else if (shape === "sphere") {
        currentShape = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    }

    // Send the shape update to the server
    sendShapeUpdate(shape, currentShape.position);
};

// Initialize the scene
createScene().then(() => {
    engine.runRenderLoop(() => {
        if (scene) {
            scene.render();
        }
    });
});

window.addEventListener("resize", () => {
    engine.resize();
});
