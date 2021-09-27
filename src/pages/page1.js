import {ParticleStore} from '../components/ParticleStore'
import * as THREE from "three"
export class TextPage {
  constructor(context) {
    this.context = context;

    this.height = null;
    this.width = null;
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mouseVector = new THREE.Vector3(0, 0, 0);
    this.mousePos = new THREE.Vector3(0, 0, 0);
    this.cameraLookAt = new THREE.Vector3(0, 0, 0);
    this.cameraTarget = new THREE.Vector3(0, 0, 800);
    this.textCanvas = null;
    this.textCtx = null;
    this.textPixels = [];
    this.input = null;
    this.particleStore;
    this.resize = this.resize.bind(this)
    this.mousemove = this.mousemove.bind(this);
    this.animate = this.animate.bind(this);
    this.updateText = this.updateText.bind(this)
    this.render  = this.render.bind(this)
  }

  init() {
    this._initStage();
    this._initScene();
    this._initCanvas();
    this._initCamera();
    this._initParticleStore();
    this._createLights();
    this._initInput();
    this.animate();
    this.updateText();
    // setTimeout(() => {
    //   this.updateText();
    // }, 40);
  }

  _initStage() {
    const { width, height } = this.context.setting;
    this.width = width;
    this.height = height;
    this.container = document.querySelector(".stage");
    window.addEventListener("resize", this.resize);
    this.container.addEventListener("mousemove", this.mousemove);
  }
  _initScene() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
  }
  _initCanvas() {
    this.textCanvas = document.querySelector(".text");
    this.textCanvas.style.width = this.width + "px";
    this.textCanvas.style.height = 200 + "px";
    this.textCanvas.width = this.width;
    this.textCanvas.height = 200;
    this.textCtx = this.textCanvas.getContext("2d");
    this.textCtx.font = "700 100px Arial";
    this.textCtx.fillStyle = "#555";
  }
  _initCamera() {
    let fieldOfView = 120;
    let aspectRatio = this.width / this.height;
    let nearPlane = 1;
    let farPlane = 3000;
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    this.camera.position.z = 800;
  }
  _initInput() {
    this.input = document.querySelector(".inputbar");
    this.input.addEventListener("keyup", this.updateText);
    this.input.value = "EDIT ME";
  }
  _initParticleStore() {
    this.particleStore = new ParticleStore(this.context);
  }
  _createLights() {
    const shadowLight = new THREE.DirectionalLight(0xffffff, 2);
    shadowLight.position.set(20, 0, 10);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = 0.01;
    this.scene.add(shadowLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-20, 0, 20);
    this.scene.add(light);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 0, -20);
    this.scene.add(backLight);
  }

  updateText() {
    let fontSize = this.width / (this.input.value.length * 1.3);
    if (fontSize > 120) fontSize = 120;
    this.textCtx.font = "700 " + fontSize + "px Arial";
    this.textCtx.clearRect(0, 0, this.width, 200);
    this.textCtx.textAlign = "center";
    this.textCtx.textBaseline = "middle";
    this.textCtx.fillText(this.input.value.toUpperCase(), this.width / 2, 50);

    let pix = this.textCtx.getImageData(0, 0, this.width, 200).data;
    this.context.textPage.textPixels = [];
    for (let i = pix.length; i >= 0; i -= 4) {
      if (pix[i] != 0) {
        let x = (i / 4) % this.width;
        let y = Math.floor(Math.floor(i / this.width) / 4);

        if (x && x % 6 == 0 && y && y % 6 == 0)
          this.context.textPage.textPixels.push({
            x: x,
            y: 200 - y + -120,
          });
      }
    }
    this.particleStore.setParticles(this.scene);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.particleStore.updateParticles();
    this.camera.position.lerp(this.cameraTarget, 0.2);
    this.camera.lookAt(this.cameraLookAt);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);

    this.textCanvas.style.width = this.width + "px";
    this.textCanvas.style.height = 200 + "px";
    this.textCanvas.width = this.width;
    this.textCanvas.height = 200;
    this.updateText();
  }

   mousemove(e) {
    let x = e.pageX - this.width / 2
    let y = e.pageY - this.height / 2
    this.cameraTarget.x = x * -1
    this.cameraTarget.y = y
  }
}
