<template>
  <v-container>
    <h1>
      Vuetify Form JSON - Example
    </h1>
    <ValidationObserver v-slot="{ invalid, passes }">
      <v-form @submit.prevent="passes(save)">
        <v-row>
          <v-col cols="4">
            <v-form-json
              :value="model"
              :schema="schema"
            >
            </v-form-json>
          </v-col>
        </v-row>
      </v-form>
    </ValidationObserver>
  </v-container>
</template>

<script>
  export default {
    name: "Example.vue",
    data() {
      return {
        model: null,
        schema: {
          name: {
            type: 'text',
            label: 'Name'
          },
          controls: {
            base: {
              type: 'checkbox',
              label: 'I agree to this [nested]'
            },
            switch: [
              {
                type: 'switch',
                label: 'I want newsletter for X [nested array]'
              },
              {
                type: "switch",
                label: 'I want newsletter for Y [nested array]'
              }
            ],
          },
          age: {
            type: 'range',
            label: 'Age',
            range: [18, 40]
          },
          file: {
            type: 'file',
            label: 'Upload file'
          },
          color: {
            type: 'color',
            label: 'Favorite Color'
          },
          today: {
            type: 'date',
            label: 'What date is it today?'
          },
          todayTime: {
            type: 'time',
            label: 'What time is it now?'
          },
          comment1: {
            type: 'textarea',
            label: 'Comment',
            outlined: true
          },
        },
      };
    }
  }
</script>

<style scoped>

</style>
