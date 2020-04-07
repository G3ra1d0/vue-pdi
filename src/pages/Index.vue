<template>
  <q-page class="row justify-around items-center">
    <div class="col-12 col-sm-5">
      <q-card bordered>
        <img ref="img" src="https://placeimg.com/500/300/nature" />
      </q-card>
    </div>
    <div class="col-12 col-sm-5 ">
      <q-card>
        <canvas :height="file.height" id="IdCanvas"></canvas>
      </q-card>
    </div>
    <div class="col-12">
      <q-btn
        class="full-width "
        @click="onUpload"
        color="white"
        text-color="black"
        label="Envia Foto"
      />
      <input
        ref="file"
        class="hidden"
        type="file"
        multiple="multiple"
        accept="image/*"
        @change="onFileChanged"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      file: "",
      ctx: "",
      canvas: ""
    };
  },
  methods: {
    drawImage(img) {
      // Desneha Imagem
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    },
    putImageData(img) {
      // Atualiza imagem
      this.ctx.putImageData(img, 0, 0);
    },
    getImageData() {
      // Pixel da imagem
      // red=imgData.data[0];
      // green=imgData.data[1];
      // blue=imgData.data[2];
      // alpha=imgData.data[3];
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    inveterImage() {
      let img = this.getImageData();
      for (let i = 0; i < img.data.length; i += 4) {
        img.data[i] = 255 - img.data[i];
        img.data[i + 1] = 255 - img.data[i + 1];
        img.data[i + 2] = 255 - img.data[i + 2];
        img.data[i + 3] = 255;
      }
      return img;
    },
    onFileChanged(event) {
      this.file = event.target.files[0];
      let preview = this.$refs.img;
      let file = this.file;
      let reader = new FileReader();

      reader.onloadend = () => {
        preview.src = reader.result;
        this.canvas.width = preview.width;
        this.canvas.height = preview.height;

        preview.onload = () => {
          this.drawImage(preview);
          let imgData = this.inveterImage();
          this.putImageData(imgData);
        };
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
      }
    },
    onUpload() {
      this.$refs.file.value = null;
      this.$refs.file.click();
    }
  },
  mounted() {
    this.canvas = document.getElementById("IdCanvas");
    this.ctx = this.canvas.getContext("2d");
  }
};
</script>
