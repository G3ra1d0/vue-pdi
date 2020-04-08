<template>
  <div>
    <!-- <canvas @mousemove="hover" :height="file.height" id="IdCanvas"></canvas> -->
    <canvas :width="largura" :height="altura" id="IdCanvas"></canvas>
    {{ largura }}
    {{ altura }}
  </div>
</template>

<script>
export default {
  name: "VueCanvas",
  data() {
    return {};
  },
  watch: {
    base64() {
      let img = new Image();
      img.src = this.base64;

      img.onload = () => {
        this.$store.dispatch("canvas/setCanvasTamanho", {
          width: img.width,
          height: img.height
        });

        setTimeout(() => {
          this.context.drawImage(img, 0, 0, this.largura, this.altura);
        }, 100);
        
      };
    }
  },
  computed: {
    largura() {
      return this.$store.getters["canvas/getLargura"];
    },
    altura() {
      return this.$store.getters["canvas/getAltura"];
    },
    canvas() {
      return this.$store.getters["canvas/getCanvas"];
    },
    context() {
      return this.$store.getters["canvas/getContext"];
    },
    base64() {
      return this.$store.getters["file/getBase64"];
    }
  },
  methods: {
    limpar() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },
  mounted() {
    let canvas = document.getElementById("IdCanvas");
    let ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";

    this.$store.dispatch("canvas/setCanvas", canvas);
    this.$store.dispatch("canvas/setContext", ctx);
  }
};
</script>
