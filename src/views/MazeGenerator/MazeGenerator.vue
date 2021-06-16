<template>
  <h1>Maze Generator</h1>

  <div>
    <input type="range" step="1" max="500" v-model="cols" /> Spalten:
    <input type="text" v-model="cols" />
  </div>
  <div>
    <input type="range" step="1" max="250" v-model="rows" /> Zeilen:
    <input type="text" v-model="rows" />
  </div>

  <div>
    <canvas ref="canvas" :width="size.width" :height="size.height"></canvas>
  </div>

  <div>
    <button @click="mazeRef.generateMaze(cols, rows)">Generate Maze</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";

class Stack<T> {
  items: T[];

  constructor() {
    this.items = [];
  }

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  top(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

class Cell {
  x: number;
  y: number;

  processed: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.processed = false;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.beginPath();
    ctx.rect(this.x * width, this.y * height, width, height);
    ctx.stroke();
  }
}

class Maze {
  width: number;
  height: number;

  cols!: number;
  rows!: number;

  ctx!: CanvasRenderingContext2D;
  cells!: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.cells = [];
  }

  setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  generateMaze(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;

    this.clearCanvas();

    this.generateCells();
    this.generatePath();
  }

  generateCells() {
    this.cells = [];
    for (let x = 0; x < this.cols; x++) {
      this.cells[x] = [];

      for (let y = 0; y < this.rows; y++) {
        const cell = new Cell(x, y);

        this.cells[x][y] = cell;
      }
    }
  }

  async generatePath() {
    const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const startX = Math.floor(Math.random() * this.cols);
    const startY = Math.floor(Math.random() * this.rows);

    const startCell = this.cells[startX][startY];

    const stack = new Stack<Cell>();
    stack.push(startCell);

    while (stack.top()) {
      const currentCell = stack.top();

      if (currentCell) {
        currentCell.processed = true;

        const adjacentCells = this.getAdjacentCells(
          currentCell.x,
          currentCell.y
        );

        if (adjacentCells.length > 0) {
          const nextCell =
            adjacentCells[Math.floor(Math.random() * adjacentCells.length)];

          stack.push(nextCell);

          this.drawLine(currentCell, nextCell);

          await timer(1);
        } else {
          stack.pop();
        }
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawLine(currentCell: Cell, nextCell: Cell) {
    this.ctx.beginPath();
    this.ctx.moveTo(
      ((currentCell.x + 0.5) * this.width) / this.cols,
      ((currentCell.y + 0.5) * this.height) / this.rows
    );
    this.ctx.lineTo(
      ((nextCell.x + 0.5) * this.width) / this.cols,
      ((nextCell.y + 0.5) * this.height) / this.rows
    );
    this.ctx.stroke();
  }

  getAdjacentCells(x: number, y: number) {
    const adjacentCells: Cell[] = [];

    if (x > 0) adjacentCells.push(this.cells[x - 1][y]);
    if (y > 0) adjacentCells.push(this.cells[x][y - 1]);
    if (x < this.cols - 1) adjacentCells.push(this.cells[x + 1][y]);
    if (y < this.rows - 1) adjacentCells.push(this.cells[x][y + 1]);

    return adjacentCells.filter((cell) => !cell.processed);
  }
}

export default defineComponent({
  data: () => ({
    cols: 20,
    rows: 10,
  }),

  setup() {
    const canvas = ref<HTMLCanvasElement>();

    const size = {
      width: 1500,
      height: 750,
    };

    const maze = new Maze(size.width, size.height);
    const mazeRef = reactive(maze);

    onMounted(() => {
      const ctx = canvas.value?.getContext("2d");

      if (ctx) {
        maze.setContext(ctx);
      }
    });

    const processedCells = computed(() => {
      let cellCount = 0;

      mazeRef.cells.forEach((col) => {
        col.forEach((cell) => {
          if (cell.processed) cellCount++;
        });
      });

      return cellCount;
    });

    return {
      canvas,
      mazeRef,
      size,
      processedCells,
    };
  },
});
</script>
