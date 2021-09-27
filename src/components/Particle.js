import * as THREE from "three";
export class Particle {
  constructor(context) {
    this.context = context;

    this.vx = Math.random() * 0.05;
    this.vy = Math.random() * 0.05;
    this.width = this.context.setting.width;
    this.height = this.context.setting.height;
    this.particle;
    this.geometryCore;
    this.materialCore;
    this.colors = ["#F7A541", "#F45D4C", "#FA2E59", "#4783c3", "#9c6cb7"];
  }

  init(i) {
    const {textPixels} = this.context.textPage
    this.particle = new THREE.Object3D();
    this.geometryCore = new THREE.BoxGeometry(20, 20, 20);
    this.materialCore = new THREE.MeshLambertMaterial({
      color: this.colors[i % this.colors.length],
      shading: THREE.FlatShading,
    });
    const box = new THREE.Mesh(this.geometryCore,this.materialCore);
    box.geometry.__dirtyVertices = true;
    box.geometry.dynamic = true;
    this.particle.targetPosition = new THREE.Vector3(
      (textPixels[i].x - this.width / 2) * 4,
      textPixels[i].y * 5,
      -10 * Math.random() + 20
    );
    this.particle.position.set(
      this.width * 0.5,
      this.height * 0.5,
      -10 * Math.random() + 20
    );
    this._randomPos(this.particle.position);
    this.particle.add(box);
  }

  _randomPos(vector) {
    let radius = this.width * 3;
    let centerX = 0;
    let centerY = 0;

    // ensure that p(r) ~ r instead of p(r) ~ constant
    let r = this.width + radius * Math.random();
    let angle = Math.random() * Math.PI * 2;

    // compute desired coordinates
    vector.x = centerX + r * Math.cos(angle);
    vector.y = centerY + r * Math.sin(angle);
  }

  updateRotation() {
    this.particle.rotation.x += this.vx;
    this.particle.rotation.y += this.vy;
  }

  updatePosition() {
    this.particle.position.lerp(this.particle.targetPosition, 0.02);
  }
}
