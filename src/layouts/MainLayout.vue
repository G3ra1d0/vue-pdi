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
      <q-list>
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
        expand-separator
        icon="add"
        label="Ampliar"
        header-class="text-primary"
      >
        <q-expansion-item
          expand-separator
          label="Pixel Vizinho"
          caption="Utilizando algoritmo Nearest Neighbor Resampling"
          header-class="text-primary"
        >
          <div class="row justify-center q-pa-sm">
            <q-btn
              flat
              color="primary"
              label="Ampliar 2x"
              @click="ampliarNNR(2)"
            />
            <q-btn
              flat
              color="primary"
              label="Ampliar 3x"
              @click="ampliarNNR(3)"
            />
          </div>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          label="Interpolação Bilinear"
          caption="Utilizando algoritmo Bilinear Interpolation Resampling"
          header-class="text-primary"
        >
          <div class="row justify-center q-pa-sm">
            <q-btn
              flat
              color="primary"
              label="Ampliar 2x"
              @click="ampliarBIR(2)"
            />
            <q-btn
              flat
              color="primary"
              label="Ampliar 3x"
              @click="ampliarBIR(3)"
            />
          </div>
        </q-expansion-item>
        <q-separator />
      </q-expansion-item>

      <q-expansion-item
        default-opened
        expand-separator
        icon="perm_media"
        label="Somar duas Imagem"
        header-class="text-primary"
      >
        <div class="row justify-around text-center">
          <div class="col-12 text-overline">
            Informe a Porcentagem:
          </div>
          <div class="col-5">
            <q-input
              label="Imagem 1"
              v-model.number="porcetagemImage1"
              type="number"
              outlined
            />
          </div>
          <div class="col-5">
            <q-input
              label="Imagem 2"
              v-model.number="porcetagemImage2"
              type="number"
              outlined
            />
          </div>
          <div class="col-12 q-pa-sm">
            <q-btn
              flat
              label="Upload 2 Imagem"
              color="primary"
              @click="upload2Imagem"
            ></q-btn>
            <q-btn
              class="q-ma-sm"
              round
              color="primary"
              icon="done"
              @click="somaImagem"
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
        </div>
        <q-separator />
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
      leftDrawerOpen: false,
      ImageData1: "",
      ImageData2: "",
      porcetagemImage1: 100,
      porcetagemImage2: 100
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
    somaImagem() {
      this.resertImagem().then(result => {
        let ImageData = this.getImageData();
        let red, blue, green, alpha;
        for (let i = 0; i < ImageData.data.length; i += 4) {
          red =
            (ImageData.data[i] * (this.porcetagemImage1 / 100) +
              this.ImageData2.data[i] * (this.porcetagemImage1 / 100)) /
            2;
          green =
            (ImageData.data[i + 1] * (this.porcetagemImage1 / 100) +
              this.ImageData2.data[i + 1] * (this.porcetagemImage1 / 100)) /
            2;

          blue =
            (ImageData.data[i + 2] * (this.porcetagemImage1 / 100) +
              this.ImageData2.data[i + 2] * (this.porcetagemImage1 / 100)) /
            2;

          ImageData.data[i] = red;
          ImageData.data[i + 1] = green;
          ImageData.data[i + 2] = blue;
          ImageData.data[i + 3] = 255;
        }
        this.putImageData(ImageData);
      });
    },
    onFileChanged(event) {
      this.ImageData1 = this.getImageData();

      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        let img = new Image();
        img.src = reader.result;

        this.context.clearRect(0, 0, this.largura, this.altura);

        img.onload = async () => {
          await this.context.drawImage(img, 0, 0, img.width, img.height);
          this.ImageData2 = this.getImageData();

          await this.$store.dispatch("canvas/setCanvasTamanho", {
            width: this.largura * 2 + 10,
            height: this.altura
          });

          this.context.putImageData(this.ImageData1, 0, 0);
          this.context.putImageData(this.ImageData2, this.largura / 2 + 10, 0);
        };
      };
    },
    upload2Imagem() {
      this.resertImagem().then(result => {
        this.$refs.file.value = null;
        this.$refs.file.click();
      });
    },
    BIR() {
      let ImageDataOriginal = this.getImageData();

      let ImageDataCopia = new ImageData(this.altura * 2, this.largura * 2);

      let pixel,
        proximoPixel = new Array(),
        posicao = 0,
        tamanhoLinha = this.largura * 2 * 4;
      for (let y = 0; y < this.altura; y++) {
        for (let x = 0; x < this.largura; x++) {
          pixel = this.context.getImageData(x, y, 2, 2).data;
          // console.log(x, ",", y, ":", pixel;
          // original
          ImageDataCopia.data[posicao] = pixel[0];
          ImageDataCopia.data[posicao + 1] = pixel[1];
          ImageDataCopia.data[posicao + 2] = pixel[2];
          ImageDataCopia.data[posicao + 3] = 255;
          // direito
          ImageDataCopia.data[posicao + 4] = (pixel[0] + pixel[4]) / 2;
          ImageDataCopia.data[posicao + 5] = (pixel[1] + pixel[5]) / 2;
          ImageDataCopia.data[posicao + 6] = (pixel[2] + pixel[6]) / 2;
          ImageDataCopia.data[posicao + 7] = 255;
          // embaixo
          ImageDataCopia.data[tamanhoLinha + posicao] =
            (pixel[0] + pixel[8]) / 2;
          ImageDataCopia.data[tamanhoLinha + posicao + 1] =
            (pixel[0] + pixel[9]) / 2;
          ImageDataCopia.data[tamanhoLinha + posicao + 2] =
            (pixel[0] + pixel[10]) / 2;
          ImageDataCopia.data[tamanhoLinha + posicao + 3] = 255;
          // embaixo lado
          ImageDataCopia.data[tamanhoLinha + posicao + 4] =
            (pixel[0] + pixel[12]) / 2;
          ImageDataCopia.data[tamanhoLinha + posicao + 5] =
            (pixel[1] + pixel[13]) / 2;
          ImageDataCopia.data[tamanhoLinha + posicao + 6] =
            (pixel[2] + pixel[14]) / 2;
          ImageDataCopia.data[tamanhoLinha + posicao + 7] = 255;

          posicao += 8;
        }
        posicao += tamanhoLinha;
      }
      let espera = async () => {
        await this.$store.dispatch("canvas/setCanvasTamanho", {
          width: this.largura * 2,
          height: this.altura * 2
        });

        this.putImageData(ImageDataCopia);
      };
      return new Promise((resolve, reject) => resolve(espera()));
    },
    async ampliarBIR(vezes) {
      await this.resertImagem().then(Response => {
        if (vezes == 2) {
          this.BIR();
        } else {
          this.BIR().then(result => {
            this.BIR();
          });
        }
      });
    },
    async NNR() {
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
      let espera = async () => {
        await this.$store.dispatch("canvas/setCanvasTamanho", {
          width: this.largura * 2,
          height: this.altura * 2
        });

        this.putImageData(ImageDataCopia);
      };
      return new Promise((resolve, reject) => resolve(espera()));
    },
    async ampliarNNR(vezes) {
      await this.resertImagem().then(Response => {
        if (vezes == 2) {
          this.NNR();
        } else {
          this.NNR().then(result => {
            this.NNR();
          });
        }
      });
    },
    limpar() {
      this.context.clearRect(0, 0, this.largura, this.altura);
    },
    async resertImagem() {
      return new Promise((resolve, reject) => {
        this.limpar();
        let img = new Image();
        img.src = this.base64;
        img.onload = async () => {
          await this.$store.dispatch("canvas/setCanvasTamanho", {
            width: img.width,
            height: img.height
          });
          this.context.drawImage(img, 0, 0, this.largura, this.altura);
          resolve(true);
        };
        img.onerror = reject;
      });
    },
    async filtroRaiz() {
      await this.resertImagem().then(Response => {
        let gama = prompt("Digite o Valor de Gama");
        if (gama != null || gama != "") {
          gama = parseFloat(gama);
          let ImageData = this.getImageData();
          for (let i = 0; i < ImageData.data.length; i += 4) {
            ImageData.data[i] =
              Math.pow(ImageData.data[i] / 255, 1 / gama) * 256;
            ImageData.data[i + 1] =
              Math.pow(ImageData.data[i + 1] / 255, 1 / gama) * 256;
            ImageData.data[i + 2] =
              Math.pow(ImageData.data[i + 2] / 255, 1 / gama) * 256;
          }
          this.putImageData(ImageData);
        } else {
          alert("Desculpe gama formato incorreto!");
        }
      });
    },
    async filtroPotencia() {
      await this.resertImagem().then(Response => {
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
      });
    },
    async filtroLogInverso() {
      await this.resertImagem().then(Response => {
        let ImageData = this.getImageData();
        for (let i = 0; i < ImageData.data.length; i += 4) {
          ImageData.data[i] = Math.pow(10, ImageData.data[i] / 105.886);
          ImageData.data[i + 1] = Math.pow(10, ImageData.data[i + 1] / 105.886);
          ImageData.data[i + 2] = Math.pow(10, ImageData.data[i + 2] / 105.886);
        }
        this.putImageData(ImageData);
      });
    },
    async filtroLog() {
      await this.resertImagem().then(Response => {
        let ImageData = this.getImageData();
        for (let i = 0; i < ImageData.data.length; i += 4) {
          ImageData.data[i] = 105.886 * Math.log10(1 + ImageData.data[i]);
          ImageData.data[i + 1] =
            105.886 * Math.log10(1 + ImageData.data[i + 1]);
          ImageData.data[i + 2] =
            105.886 * Math.log10(1 + ImageData.data[i + 2]);
        }

        this.putImageData(ImageData);
      });
    },
    async filtroNegativo() {
      await this.resertImagem().then(Response => {
        let ImageData = this.getImageData();
        for (let i = 0; i < ImageData.data.length; i += 4) {
          ImageData.data[i] = 255 - ImageData.data[i];
          ImageData.data[i + 1] = 255 - ImageData.data[i + 1];
          ImageData.data[i + 2] = 255 - ImageData.data[i + 2];
          ImageData.data[i + 3] = 255;
        }
        this.putImageData(ImageData);
      });
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
