<template>
  <div>
    <q-btn flat dense  icon="add" @click="onUpload" label="Upload da Imagem"/>
    <input
      ref="file"
      class="hidden"
      type="file"
      multiple="multiple"
      accept="image/*"
      @change="onFileChanged"
    />
  </div>
</template>

<script>
export default {
  name: "UploadArquivo",
  data() {
    return {};
  },
  methods: {
    onFileChanged(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.$store.dispatch("file/setBase64", reader.result);
      };
      this.$store.dispatch("file/setFile", file);
    },
    onUpload() {
      this.$refs.file.value = null;
      this.$refs.file.click();
    }
  }
};
</script>
