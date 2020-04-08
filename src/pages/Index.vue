<template>
  <q-page class="row justify-around items-center">
    <div class="col-12">
      <!-- <canvas @mousemove="hover" :height="file.height" id="IdCanvas"></canvas> -->
      <VueCanvas />
    </div>
  </q-page>
</template>

<script>
import VueCanvas from "../components/VueCanvas.vue";
export default {
  name: "PageIndex",
  components: {
    VueCanvas
  },
  data() {
    return {};
  }
};
</script>
