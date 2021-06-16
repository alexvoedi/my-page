import { Vector } from "@/common/Vector";
import { GraphSize } from "@/views/ParticleSwarmOptimization/GraphSize";
import { Particle } from "@/views/ParticleSwarmOptimization/Particle";
import { PSOParams } from "@/views/ParticleSwarmOptimization/PSOParams";

export class PSO {
  params: PSOParams;
  f: (vector: Vector) => number;
  size: GraphSize;

  particles: Particle[];

  gBest: Vector;
  gBestFitness: number;

  lastUpdate: number;

  constructor(
    f: (vector: Vector) => number,
    params: PSOParams,
    size: GraphSize
  ) {
    this.f = f;
    this.params = params;
    this.size = size;

    this.particles = [];

    this.gBest = new Vector(0, 0);
    this.gBestFitness = Infinity;

    this.lastUpdate = Date.now();
  }

  createParticles(particlesCount: number): void {
    for (let i = 0; i < particlesCount; i++) {
      this.addParticle();
    }
  }

  nextIteration(): void {
    this.particles.forEach((particle) => {
      particle.updateCurrentFitness(this.f);
    });

    this.particles.forEach((particle) => {
      if (particle.pBestFitness < this.gBestFitness) {
        this.gBestFitness = particle.pBestFitness;
        this.gBest = particle.pBest;
      }
    });

    this.particles.forEach((particle) => {
      particle.updateVelocity(this.gBest, this.params);
    });
  }

  draw(ctx: CanvasRenderingContext2D, size: GraphSize): void {
    ctx.clearRect(0, 0, size.width, size.height);

    this.particles.forEach((particle) => {
      particle.updatePosition();
      particle.draw(ctx, this.size);
    });
  }

  simulate(ctx: CanvasRenderingContext2D, size: GraphSize): void {
    requestAnimationFrame(() => this.simulate(ctx, size));

    this.nextIteration();

    const now = Date.now();
    // const delta = (now - this.lastUpdate) / 1000;

    this.lastUpdate = now;

    this.draw(ctx, size);
  }

  reset(): void {
    this.gBest = new Vector(0, 0);
    this.gBestFitness = Infinity;

    this.particles.forEach((particle) => particle.reset());
  }

  setFunction(f: (vector: Vector) => number): void {
    this.reset();

    this.f = f;
  }

  addParticle(): void {
    const x =
      this.size.x.min + Math.random() * (this.size.x.max - this.size.x.min);
    const y =
      this.size.y.min + Math.random() * (this.size.y.max - this.size.y.min);

    const particle = new Particle(x, y);

    this.particles.push(particle);
  }

  shuffleParticles(): void {
    this.reset();

    this.particles.forEach((particle) => {
      const x =
        this.size.x.min + Math.random() * (this.size.x.max - this.size.x.min);
      const y =
        this.size.y.min + Math.random() * (this.size.y.max - this.size.y.min);

      particle.setPosition(x, y);
    });
  }
}
