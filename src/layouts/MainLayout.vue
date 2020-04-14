<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Vue-PDI
        </q-toolbar-title>

        <UploadArquivo />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list bordered>
        <q-expansion-item
          group="somegroup"
          icon="photo_filter"
          label="Filtros"
          header-class="text-primary"
        >
          <q-list>
            <q-item clickable v-ripple @click="filtroNegativo">
              <q-item-section>
                <q-item-label>Negativo</q-item-label>
                <q-item-label caption
                  >Aplica Filtro negativo na imagem</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="filtroLog">
              <q-item-section>
                <q-item-label>Logaritmo</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Logaritmo na imagem</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="filtroLogInverso">
              <q-item-section>
                <q-item-label>Logaritmo Inverso</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Logaritmo Inverso na imagem</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="filtroPotencia">
              <q-item-section>
                <q-item-label>Potencia</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Potencia na imagem</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="filtroRaiz">
              <q-item-section>
                <q-item-label>Raiz</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Raiz na imagem</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-separator />
      </q-list>
      <q-expansion-item
        group="somegroup"
        icon="add"
        label="Ampliar"
        header-class="text-primary"
      >
        <q-list>
          <q-item clickable v-ripple @click="ampliarNNR">
            <q-item-section>
              <q-item-label>Nearest Neighbor Resampling</q-item-label>
              <q-item-label caption>Ampliar imagem</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="ampliarBIR">
            <q-item-section>
              <q-item-label>Bilinear Interpolation Resampling</q-item-label>
              <q-item-label caption>Ampliar imagem</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-drawer>

    <q-page-container>
      <router-view @color="cor = $event" />
    </q-page-container>
  </q-layout>
</template>

<script>
import UploadArquivo from "../components/UploadArquivo.vue";
export default {
  name: "MainLayout",
  components: {
    UploadArquivo
  },
  data() {
    return {
      leftDrawerOpen: false
    };
  },
  computed: {
    context() {
      return this.$store.getters["canvas/getContext"];
    },
    base64() {
      return this.$store.getters["file/getBase64"];
    },
    largura() {
      return this.$store.getters["canvas/getLargura"];
    },
    altura() {
      return this.$store.getters["canvas/getAltura"];
    }
  },
  methods: {
    ampliarBIR() {},
    ampliarNNR() {
      this.resertImagem();
      let ImageDataOriginal = this.getImageData();

      let ImageDataCopia = new ImageData(this.altura * 2, this.largura * 2);

      let pixel,
        posicao = 0,
        tamanhoLinha = this.largura * 2 * 4;
      for (let y = 0; y < this.altura; y++) {
        for (let x = 0; x < this.largura; x++) {
          pixel = this.context.getImageData(x, y, 1, 1).data;
          // console.log(x, ",", y, ":", pixel);
          // original
          ImageDataCopia.data[posicao] = pixel[0];
          ImageDataCopia.data[posicao + 1] = pixel[1];
          ImageDataCopia.data[posicao + 2] = pixel[2];
          ImageDataCopia.data[posicao + 3] = pixel[3];
          // direito
          ImageDataCopia.data[posicao + 4] = pixel[0];
          ImageDataCopia.data[posicao + 5] = pixel[1];
          ImageDataCopia.data[posicao + 6] = pixel[2];
          ImageDataCopia.data[posicao + 7] = pixel[3];
          // embaixo
          ImageDataCopia.data[tamanhoLinha + posicao] = pixel[0];
          ImageDataCopia.data[tamanhoLinha + posicao + 1] = pixel[1];
          ImageDataCopia.data[tamanhoLinha + posicao + 2] = pixel[2];
          ImageDataCopia.data[tamanhoLinha + posicao + 3] = pixel[3];
          // embaixo lado
          ImageDataCopia.data[tamanhoLinha + posicao + 4] = pixel[0];
          ImageDataCopia.data[tamanhoLinha + posicao + 5] = pixel[1];
          ImageDataCopia.data[tamanhoLinha + posicao + 6] = pixel[2];
          ImageDataCopia.data[tamanhoLinha + posicao + 7] = pixel[3];

          posicao += 8;
        }
        posicao += tamanhoLinha;
      }
      this.$store.dispatch("canvas/setCanvasTamanho", {
        width: this.largura * 2,
        height: this.altura * 2
      });
      setTimeout(() => {
        console.log(ImageDataOriginal);
        console.log(ImageDataCopia);
        this.putImageData(ImageDataCopia);
      }, 1000);
    },
    limpar() {
      this.context.clearRect(0, 0, this.largura, this.altura);
    },
    resertImagem() {
      this.limpar();
      let img = new Image();
      img.src = this.base64;
      this.context.drawImage(img, 0, 0, this.largura, this.altura);
    },
    filtroRaiz() {
      this.resertImagem();
      let gama = prompt("Digite o Valor de Gama");
      if (gama != null || gama != "") {
        gama = parseFloat(gama);
        let ImageData = this.getImageData();
        for (let i = 0; i < ImageData.data.length; i += 4) {
          ImageData.data[i] = Math.pow(ImageData.data[i] / 255, 1 / gama) * 256;
          ImageData.data[i + 1] =
            Math.pow(ImageData.data[i + 1] / 255, 1 / gama) * 256;
          ImageData.data[i + 2] =
            Math.pow(ImageData.data[i + 2] / 255, 1 / gama) * 256;
        }
        this.putImageData(ImageData);
      } else {
        alert("Desculpe gama formato incorreto!");
      }
    },
    filtroPotencia() {
      this.resertImagem();
      let gama = prompt("Digite o Valor de Gama");
      if (gama != null || gama != "") {
        gama = parseFloat(gama);
        let ImageData = this.getImageData();
        for (let i = 0; i < ImageData.data.length; i += 4) {
          ImageData.data[i] = Math.pow(ImageData.data[i] / 255, gama) * 256;
          ImageData.data[i + 1] =
            Math.pow(ImageData.data[i + 1] / 255, gama) * 256;
          ImageData.data[i + 2] =
            Math.pow(ImageData.data[i + 2] / 255, gama) * 256;
        }
        this.putImageData(ImageData);
      } else {
        alert("Desculpe gama formato incorreto!");
      }
    },
    filtroLogInverso() {
      this.resertImagem();
      let ImageData = this.getImageData();
      for (let i = 0; i < ImageData.data.length; i += 4) {
        ImageData.data[i] = Math.pow(10, ImageData.data[i] / 105.886);
        ImageData.data[i + 1] = Math.pow(10, ImageData.data[i + 1] / 105.886);
        ImageData.data[i + 2] = Math.pow(10, ImageData.data[i + 2] / 105.886);
      }
      this.putImageData(ImageData);
    },
    filtroLog() {
      this.resertImagem();
      let ImageData = this.getImageData();
      for (let i = 0; i < ImageData.data.length; i += 4) {
        ImageData.data[i] = 105.886 * Math.log10(1 + ImageData.data[i]);
        ImageData.data[i + 1] = 105.886 * Math.log10(1 + ImageData.data[i + 1]);
        ImageData.data[i + 2] = 105.886 * Math.log10(1 + ImageData.data[i + 2]);
      }

      this.putImageData(ImageData);
    },
    filtroNegativo() {
      this.resertImagem();
      let ImageData = this.getImageData();
      for (let i = 0; i < ImageData.data.length; i += 4) {
        ImageData.data[i] = 255 - ImageData.data[i];
        ImageData.data[i + 1] = 255 - ImageData.data[i + 1];
        ImageData.data[i + 2] = 255 - ImageData.data[i + 2];
        ImageData.data[i + 3] = 255;
      }
      this.putImageData(ImageData);
    },
    putImageData(img) {
      // Atualiza imagem
      this.context.putImageData(img, 0, 0);
    },
    getImageData() {
      // Pixel da imagem
      // red=imgData.data[0];
      // green=imgData.data[1];
      // blue=imgData.data[2];
      // alpha=imgData.data[3];
      return this.context.getImageData(0, 0, this.largura, this.altura);
    }
  }
};
</script>
