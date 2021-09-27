import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
export class Page2 {
  constructor(context) {
    this.camera;
    this.scene;
    this.renderer;

    this.context = context;
    this.width = this.context.setting.width;
    this.height = this.context.setting.height;

    this.table = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.objects = [];
    this.target = {
      helix: [],
      table:[]
    };
    this.vector; // ?

    this.started = false

    this._onWindowResize = this._onWindowResize.bind(this)
    this._animate = this._animate.bind(this);
    this.render = this.render.bind(this);
    this._init();
  }

  _init() {
    this._initCamera();
    this._initScene();
    this._createElements();
    this.vector = new THREE.Vector3();
    this._helix();

    // this._transform(this.target.helix, 2000);
    window.addEventListener('scroll',()=>{
        if(this.started === false && window.scrollY > 1700){
            this._transform(this.target.helix, 2000);
            this.started = true
        }
    })
    window.addEventListener("resize", this._onWindowResize);
    this._animate();
  }

  _initCamera() {
    let fieldOfView = 40;
    let aspectRatio = this.width / this.height;
    let nearPlane = 1;
    let farPlane = 10000;
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    this.camera.position.z = 3000;

  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.renderer = new CSS3DRenderer();


    this.renderer.setSize(this.width, this.height);
    document
      .getElementById("floatCardPage")
      .appendChild(this.renderer.domElement);
  }

  _createElements() {

    for (let i = 0; i < this.table.length; i++) {
      const element = document.createElement("div");
      element.className = "element";
      element.style.backgroundColor =
        "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
      element.innerText = this.table[i];

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = Math.random() * 4000 - 2000;
      objectCSS.position.y = Math.random() * 4000 - 2000;
      objectCSS.position.z = Math.random() * 4000 - 2000;

      this.scene.add(objectCSS);
      this.objects.push(objectCSS);

    //   const object = new THREE.Object3D();
    //   object.position.x = this.table[i + 3] * 140 - 1330;
    //   object.position.y = -(this.table[i + 4] * 180) + 990;

    //   this.targets.table.push(object);
    }
  }

  _helix() {
    for (let i = 0, l = this.objects.length; i < l; i++) {
      const theta = i * 0.175 + Math.PI;
      const y = -(i * 8) + 450;

      const object = new THREE.Object3D();

      object.position.setFromCylindricalCoords(900, theta, y);

      this.vector.x = object.position.x * 2;
      this.vector.y = object.position.y;
      this.vector.z = object.position.z * 2;

      object.lookAt(this.vector);

      this.target.helix.push(object);
    }
  }

  _transform(targets, duration) {
    TWEEN.removeAll(); // ?

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const target = targets[i];

      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(this.render)
      .start();
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  _animate() {
    requestAnimationFrame(this._animate);

    TWEEN.update();
  }
}
