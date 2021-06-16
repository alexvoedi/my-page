<template>
  <div id="nav">
    <router-link :to="{ name: 'MazeGenerator' }">Maze Generator</router-link>
    <router-link :to="{ name: 'ParticleSwarmOptimization' }"
      >Particle Swarm Optimization</router-link
    >
  </div>

  <router-view />
</template>

<style lang="scss"></style>
