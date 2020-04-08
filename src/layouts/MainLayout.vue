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
          default-opened
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
