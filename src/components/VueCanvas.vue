<template>
  <div>
    <!-- <canvas @mousemove="hover" :height="file.height" id="IdCanvas"></canvas> -->
    <canvas
      @mousemove="hover"
      @mouseout="mouseout"
      :width="largura"
      :height="altura"
      id="IdCanvas"
    ></canvas>
    <p>Tamanhdo da Imagem l x h: {{ largura }} X {{ altura }}</p>
    <p>Posicao do Mouse Y: {{ pixelY }} Posicao do Mouse X: {{ pixelX }}</p>
    <p>Cor do Pixel (X, Y): {{ pixelCor }}</p>
  </div>
</template>

<script>
export default {
  name: "VueCanvas",
  data() {
    return {
      pixelX: "",
      pixelY: "",
      pixelCor: ""
    };
  },
  watch: {
    base64() {
      this.limpar();
      let img = new Image();
      img.src = this.base64;

      img.onload = async () => {
        await this.$store.dispatch("canvas/setCanvasTamanho", {
          width: img.width,
          height: img.height
        });
        this.context.drawImage(img, 0, 0, this.largura, this.altura);
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
    mouseout(e) {
      this.pixelX = "";
      this.pixelY = "";
      this.pixelCor = `RGB()`;
    },
    hover(e) {
      e.preventDefault();
      e.stopPropagation();
      let imageData = this.context.getImageData(e.layerX, e.layerY, 1, 1);
      this.pixelX = e.layerX;
      this.pixelY = e.layerY;
      this.pixelCor = `RGB(${imageData.data[0]},${imageData.data[1]},${imageData.data[2]})`;
    },
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
