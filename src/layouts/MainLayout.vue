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
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Negativo</q-item-label>
                <q-item-label caption
                  >Aplica Filtro negativo na imagem</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Logaritmo</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Logaritmo na imagem</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Logaritmo Inverso</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Logaritmo Inverso na imagem</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Potencia</q-item-label>
                <q-item-label caption
                  >Aplica Filtro Potencia na imagem</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
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
  }
};
</script>
