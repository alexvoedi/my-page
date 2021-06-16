import { Vector } from "@/common/Vector";
import { GraphSize } from "@/views/ParticleSwarmOptimization/GraphSize";
import { PSOParams } from "@/views/ParticleSwarmOptimization/PSOParams";

export class Particle {
  position!: Vector;
  velocity!: Vector;

  pBest!: Vector;

  pBestFitness!: number;
  currentFitness!: number;

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);

    this.reset();
  }

  reset(): void {
    this.velocity = new Vector(0, 0);

    this.pBest = this.position;

    this.currentFitness = Infinity;
    this.pBestFitness = Infinity;
  }

  updateCurrentFitness(f: (vector: Vector) => number): void {
    this.currentFitness = f(this.position);

    if (this.currentFitness < this.pBestFitness) {
      this.pBestFitness = this.currentFitness;
      this.pBest = this.position;
    }
  }

  updateVelocity(gBest: Vector, params: PSOParams): void {
    const { w, c_1, c_2 } = params;

    const r_1 = Math.random();
    const r_2 = Math.random();

    const newVelocity = this.velocity.v.map(
      (v_i, i) =>
        w * v_i +
        c_1 * r_1 * (this.pBest.v[i] - this.position.v[i]) +
        c_2 * r_2 * (gBest.v[i] - this.position.v[i])
    );

    this.velocity = new Vector(...newVelocity);
  }

  setPosition(x: number, y: number): void {
    this.position.v[0] = x;
    this.position.v[1] = y;
  }

  updatePosition(): void {
    const newPosition = this.position.v.map(
      (x_i, i) => x_i + this.velocity.v[i]
    );

    this.position = new Vector(...newPosition);
  }

  draw(ctx: CanvasRenderingContext2D, size: GraphSize): void {
    const wHalf = size.width / 2;
    const hHalf = size.height / 2;

    const x =
      wHalf + (wHalf * this.position.v[0]) / ((size.x.max - size.y.min) / 2);

    const y =
      hHalf + (hHalf * this.position.v[1]) / ((size.x.max - size.y.min) / 2);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    const l = Math.sqrt(this.velocity.v.reduce((sum, x) => sum + x ** 2, 0));

    let v = this.velocity.v.map((val) => 10 * (val / l));

    v = this.velocity.v.map((val) => 10 * val);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + v[0], y + v[1]);
    ctx.stroke();
  }

  lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }
}
