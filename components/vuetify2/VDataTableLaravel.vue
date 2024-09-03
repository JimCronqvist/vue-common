<template>
  <div class="v-data-table-laravel">
    <v-data-table-server v-bind="getVDataTableAttributes" :page="page">
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-data-table-server>
    <v-pagination v-model="page" v-bind="getVPaginationAttributes" />
  </div>
</template>

<script>
  import { useAttrsByKind } from '@cronqvist/vue-common/composables/useAttrsByKind';

  // Usage:
  // <v-data-table-laravel :headers="headers" :items="items" :loading="loading" v-model="page" @input="fetchData"></v-data-table-laravel>

  export default {
    name: "VDataTableLaravel",
    inheritAttrs: false,
    props: {
      modelValue: {
        type: Number,
        default: 1
      },
    },
    emits: ['update:modelValue'],
    setup() {
      const { attributes, listeners, styleClassAttributes } = useAttrsByKind();
      return { attributes, listeners, styleClassAttributes };
    },
    data() {
      return {
        page: 1,
        defaultDataTableAttributes: {
          loading: "true",
          hover: true,
          'disable-pagination': true,
          'hide-default-footer': true,
          'total-visible': 11,
        },
        defaultPaginationAttributes: {
          class: 'mt-2',
        },
      };
    },
    computed: {
      getVDataTableAttributes() {
        let {items, ...parentAttrs} = this.$attrs;
        let attrs = {...this.defaultDataTableAttributes, ...parentAttrs};
        attrs['items'] = items.data || [];
        attrs['items-per-page'] = items.meta && items.meta.per_page || 10;
        attrs['items-length'] = items.meta && items.meta.total || -1;
        if(attrs['onClick:row']) {
          attrs['onClick:row'] = this.onClickRowCallback;
        }
        //console.log('VDataTableAttributes', attrs);
        return attrs;
      },
      getVPaginationAttributes() {
        let { items, circle } = this.$attrs;
        let attrs = {...this.defaultPaginationAttributes, circle};
        attrs['length'] = items.meta && items.meta.last_page || 1;
        attrs['value'] = items.meta && items.meta.current_page || 1;
        //console.log('VPaginationAttributes', attrs);
        return attrs;
      }
    },
    watch: {
      page() {
        this.$emit('update:modelValue', this.page);
      }
    },
    methods: {
      // Retain Vue 2 order of parameters, as they make more sense for a server side table.
      onClickRowCallback(event, { item }) {
        (this.$attrs['onClick:row'])(item, event);
      }
    }
  }
</script>

<style scoped>

</style>
