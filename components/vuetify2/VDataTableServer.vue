<template>
  <div class="v-data-table-server">
    <v-data-table v-bind="getVDataTableAttributes" v-on="$listeners" :page="page">
      <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
      <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
    </v-data-table>
    <v-pagination v-model="page" v-bind="getVPaginationAttributes"></v-pagination>
  </div>
</template>

<script>
  // Usage:
  // <v-data-table-server :headers="headers" :items="items" :loading="loading" v-model="page" @input="fetchData"></v-data-table-server>

  export default {
    name: "v-data-table-server",
    props: ['value'],
    data() {
      return {
        page: 1,
        defaultDataTableAttributes: {
          loading: "true",
          'disable-pagination': true,
          'hide-default-footer': true,
          'total-visible': 11,
        },
        defaultPaginationAttributes: {
          class: 'mt-2',
        },
      };
    },
    watch: {
      page() {
        this.$emit('input', this.page);
      }
    },
    computed: {
      getVDataTableAttributes() {
        let {items, ...parentAttrs} = this.$attrs;
        let attrs = {...this.defaultDataTableAttributes, ...parentAttrs};
        attrs['items'] = items.data || [];
        attrs['items-per-page'] = items.meta && items.meta.per_page || 10;
        attrs['server-items-length'] = items.meta && items.meta.total || -1;
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
    }
  }
</script>

<style scoped>

</style>
