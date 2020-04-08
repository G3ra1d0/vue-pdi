<template>
  <q-page class="row justify-around items-center">
    <div class="col-12">
      <!-- <canvas @mousemove="hover" :height="file.height" id="IdCanvas"></canvas> -->
      <VueCanvas />
    </div>
    <div class="col-12">
      <q-btn @click="log" color="white" text-color="black" label="Log" />
      <q-btn @click="invLog" color="white" text-color="black" label="Inv Log" />
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
