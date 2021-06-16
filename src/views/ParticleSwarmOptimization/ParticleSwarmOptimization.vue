<template>
  <h1>Particle Swarm Optimization</h1>

  <div>
    <canvas
      @click="(e) => onClick(e)"
      ref="canvas"
      :width="size.width"
      :height="size.height"
    ></canvas>
  </div>

  <div>
    {{ psoRef.gBestFitness }}
  </div>

  <div class="form-group">
    <div class="form-label">Optimization functions</div>

    <label
      v-for="(optFunction, index) in availableOptFunctions"
      :key="index"
      class="form-radio"
    >
      <input
        type="radio"
        :id="index"
        :value="optFunction"
        v-model="selectedFunction"
        @click="psoRef.setFunction(optFunction.f)"
      />
      <i class="form-icon"></i> {{ optFunction.name }}
    </label>
  </div>

  <div>
    <button @click="psoRef.addParticle()">Add Particle</button>
    <button @click="psoRef.shuffleParticles()">Shuffle Particles</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { availableOptFunctions } from "./optFunctions";
import { PSOParams } from "./PSOParams";
import { PSO } from "./PSO";
import { Vector } from "@/common/Vector";

export default defineComponent({
  setup() {
    const canvas = ref<HTMLCanvasElement>();

    const size = {
      width: 1500,
      height: 750,
      x: {
        min: -10,
        max: +10,
      },
      y: {
        min: -10,
        max: +10,
      },
    };
    const selectedFunction = ref(availableOptFunctions[0]);

    const params: PSOParams = {
      w: 0.729,
      c_1: 1.494,
      c_2: 1.494,
    };

    const pso = new PSO(selectedFunction.value.f, params, size);
    const psoRef = reactive(pso);

    onMounted(() => {
      const ctx = canvas.value?.getContext("2d");

      if (ctx) {
        psoRef.createParticles(30);
        psoRef.simulate(ctx, size);
      }
    });

    const onClick = (e: MouseEvent) => {
      const rect = canvas.value?.getBoundingClientRect();

      selectedFunction.value = availableOptFunctions[0];

      if (rect) {
        const x =
          size.x.min +
          ((e.clientX - rect.left) / size.width) * (size.x.max - size.x.min);

        const y =
          size.y.min +
          ((e.clientY - rect.top) / size.height) * (size.y.max - size.y.min);

        psoRef.setFunction((v: Vector): number => {
          return (v.v[0] - x) ** 2 + (v.v[1] - y) ** 2;
        });
      }
    };

    return {
      canvas,
      size,
      pso,
      psoRef,
      onClick,
      selectedFunction,
      availableOptFunctions,
    };
  },
});
</script>
