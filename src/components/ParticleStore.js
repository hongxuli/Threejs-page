import {Particle} from './Particle';

export class ParticleStore {
  constructor(context) {
    this.context = context;
    this.width = this.context.setting.width;
    this.height = this.context.setting.height;

    this.particles = [];
  }

  updateParticles() {
    for (let i = 0, l = this.particles.length; i < l; i++) {
      this.particles[i].updateRotation();
      this.particles[i].updatePosition();
    }
  }

  setParticles(scene) {
    for (let i = 0; i < this.context.textPage.textPixels.length; i++) {
      if (this.particles[i]) {
        this.particles[i].particle.targetPosition.x =
          (this.context.textPage.textPixels[i].x - this.width / 2) * 4;
        this.particles[i].particle.targetPosition.y =
          this.context.textPage.textPixels[i].y * 5;
        this.particles[i].particle.targetPosition.z = -10 * Math.random() + 20;
      } else {
        let p = new Particle(this.context);
        p.init(i);
        scene.add(p.particle);
        this.particles[i] = p;
      }
    }

    for (
      let i = this.context.textPage.textPixels.length;
      i < this.particles.length;
      i++
    ) {
      this._randomPos(this.particles[i].particle.targetPosition);
    }
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
}
