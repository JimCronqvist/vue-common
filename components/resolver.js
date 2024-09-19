export default function() {
  return (name) => {
    if(name === 'VFormJson') return '@cronqvist/vue-common/components/vuetify/VFormJson/VFormJson.vue';
    if(name === 'VDataTableLaravel') return '@cronqvist/vue-common/components/vuetify/VDataTableLaravel.vue';
  };
};
