import { Vector } from "@/common/Vector";

export const availableOptFunctions = [
  {
    name: "Sphere",
    f: (v: Vector): number => {
      return v.v.reduce((sum, x_i) => sum + x_i ** 2, 0);
    },
  },
  {
    name: "Schaffer's f6",
    f: (v: Vector): number => {
      const squaredSum = v.v.reduce((sum, x_i) => sum + x_i ** 2, 0);

      return (
        0.5 -
        (Math.sin(Math.sqrt(squaredSum)) ** 2 - 0.5) /
          (1 + 0.001 * squaredSum) ** 2
      );
    },
  },
  {
    name: "Rastrigin",
    f: (v: Vector): number => {
      return v.v.reduce(
        (sum, x_i) => sum + (x_i ** 2 - 10 * Math.cos(2 * Math.PI * x_i) + 10),
        0
      );
    },
  },
  {
    name: "Rosenbrock",
    f: (v: Vector): number => {
      let sum = 0;

      for (let i = 0; i < v.v.length - 1; i++) {
        sum += 100 * (v.v[i + 1] - v.v[i] ** 2) ** 2 + (v.v[i] - 1) ** 2;
      }

      return sum;
    },
  },
];
