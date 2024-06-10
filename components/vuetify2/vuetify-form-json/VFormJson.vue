<template>
  <v-row>
    <template v-for="(obj, index) in flatCombinedArray" :key="index">
      <v-col
        v-show="!obj.schema.hidden"
        v-bind="getColBind(obj)"
        :class="getClassName(obj)"
      >

        <!-- slot on top of item  -> <v-btn slot="top-slot-[key]> -->
        <slot :name="`slot-top-type-${getType(obj)}`"></slot>
        <slot :name="`slot-top-key-${getKeyAsClass(obj)}`"></slot>

        <!-- slot replaces complete item of defined type -> <div slot="item-slot-[type]>-->
        <slot :name="`slot-item-type-${getType(obj)}`">
          <!-- slot replaces complete item of defined key -> <div slot="item-slot-[key]>-->
          <slot :name="`slot-item-key-${getKeyAsClass(obj)}`">

            <!-- VeeValidate -->
            <ValidationProvider
              :name="` `"
              :vid="obj.key"
              :rules="obj.schema.rules"
              v-slot="{ errors }"
            >

              <!-- radio -->
              <v-radio-group
                v-if="obj.schema.type === 'radio'"
                v-bind="{...obj.schema, rules: []}"
                :value="setValue(obj)"
                @change="onInput($event, obj)"
                :error-messages="errors"
              >
                <v-radio
                  v-for="(o,ix) in obj.schema.options"
                  v-bind="{...obj.schema, rules: []}"
                  :key="ix"
                  :label="sanitizeRadioOption(o).label"
                  :value="sanitizeRadioOption(o).value"
                ></v-radio>
              </v-radio-group>

              <!-- checkbox || switch -->
              <div
                v-else-if="obj.schema.type === 'switch' || obj.schema.type === 'checkbox'"
                :is="mapTypeToComponent(obj.schema.type)"
                :input-value="setValue(obj)"
                v-bind="{...obj.schema, rules: []}"
                @change="onInput($event, obj)"
                :error-messages="errors"
              ></div>

              <!-- file -->
              <v-file-input
                v-else-if="obj.schema.type === 'file'"
                :value="setValue(obj)"
                v-bind="{...obj.schema, rules: []}"
                @change="onInput($event, obj)"
                :error-messages="errors"
              ></v-file-input>

              <!-- date || time -->
              <v-menu
                v-else-if="obj.schema.type === 'date' || obj.schema.type === 'time'"
                :close-on-content-click="obj.schema.type === 'date'"
                :nudge-right="33"
                :nudge-bottom="-10"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    :prepend-icon="obj.schema.type === 'date' ? 'mdi-calendar-month-outline' : 'mdi-clock-outline'"
                    clearable
                    readonly
                    v-bind="{...obj.schema, rules: []}"
                    :value="setValue(obj)"
                    @input="onInput($event, obj)"
                    :error-messages="errors"
                    type="text"
                  ></v-text-field>
                </template>
                <div
                  :is="mapTypeToComponent(obj.schema.type)"
                  @input="onInput($event, obj)"
                  v-bind="{...obj.schema, rules: []}"
                  :value="setValue(obj)"
                ></div>
              </v-menu>

              <!-- color -->
              <v-menu
                v-else-if="obj.schema.type === 'color'"
                :close-on-content-click="false"
                :nudge-right="33"
                :nudge-bottom="-10"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    prepend-icon="mdi-format-color-fill"
                    clearable
                    readonly
                    v-bind="{...obj.schema, rules: []}"
                    :value="obj.value"
                    @input="onInput($event, obj)"
                    :error-messages="errors"
                    type="text"
                  >
                    <template v-slot:prepend v-if="obj.value">
                      <v-sheet
                        style="margin: 0 3px"
                        height="20"
                        width="18"
                        :color="obj.value || 'transparent'"
                      ></v-sheet>
                    </template>
                  </v-text-field>
                </template>
                <v-color-picker
                  mode="hexa"
                  hide-mode-switch
                  @update:color="onColor($event, obj)"
                  v-bind="{...obj.schema, rules: []}"
                  :value="setValue(obj) || '#000000'"
                ></v-color-picker>
              </v-menu>

              <!-- All other Types -->
              <div
                v-else
                :is="mapTypeToComponent(obj.schema.type)"
                v-bind="{...obj.schema, rules: []}"
                v-on="getInputOn(obj.schema)"
                :value="setValue(obj)"
                @input="onInput($event, obj)"
                :error-messages="errors"
                :menu-props="{ offsetY: true }"
              >{{ typeof obj.schema['v-text'] !== 'undefined' ? obj.schema['v-text'] : '' }}</div>

            </ValidationProvider>

          </slot>
        </slot>

        <!-- slot at bottom of item -> <div slot="slot-bottom-key-[deep-nested-key-name]> -->
        <slot :name="`slot-bottom-type-${getType(obj)}`"></slot>
        <slot :name="`slot-bottom-key-${getKeyAsClass(obj)}`"></slot>

      </v-col>

      <!-- push next item to the right and fill space between items -->
      <v-spacer v-if="obj.schema.spacer"></v-spacer>

    </template>
  </v-row>
</template>

<script>
  // Inspired by: https://github.com/wotamann/vuetify-form-base

  import _get from 'lodash/get';
  import _isPlainObject from 'lodash/isPlainObject';
  import _isFunction from 'lodash/isFunction';
  import _isString from 'lodash/isString';
  import _isEmpty from 'lodash/isEmpty';

  //import { VTextField, VSlider, VSwitch, VCheckbox, VColorPicker, VDatePicker, VTimePicker, VTextarea, VSelect } from 'vuetify/components';

  const typeToComponent = {
    // Use native HTML5 Input Types - https://www.wufoo.com/html5/
    text: 'v-text-field',
    password: 'v-text-field',
    email: 'v-text-field',
    tel: 'v-text-field',
    url: 'v-text-field',
    search: 'v-text-field',
    number: 'v-text-field',

    // Map schema.type to vuetify-control (vuetify 2.0)
    range: 'v-slider',
    file: 'v-file-input',
    switch: 'v-switch',
    checkbox: 'v-checkbox',
    color: 'v-color-picker',
    date: 'v-date-picker',
    time: 'v-time-picker',
    textarea: 'v-textarea',
    select: 'v-select',
  };

  export default {
    name: 'v-form-json',
    //components: { VTextField, VSlider, VSwitch, VCheckbox, VColorPicker, VDatePicker, VTimePicker, VTextarea, VSelect },
    props: {
      value: {
        type: Object,
        required: true
      },
      schema: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        flatCombinedArray: [],
      }
    },
    computed: {
      storeStateData () {
        this.updateArrayFromState(this.schema, this.value); // Revisit this one, not very optimal...
        return this.value;
      },
      storeStateSchema () {
        this.updateArrayFromState(this.schema, this.value); // Revisit this one, not very optimal...
        return this.schema;
      }
    },
    methods: {
      mapTypeToComponent (type) {
        return typeToComponent[type] ? typeToComponent[type] : `${type}`
      },
      getType(obj) {
        return obj.schema.type;
      },
      getKeyAsClass(obj) {
        return obj.key.replace(/\./g, '-');
      },
      // Handle cols, order, offset for the <v-col> element
      getColBind(obj) {
        const keysToColAttributes = (key, prefix) => {
          if(typeof key === 'undefined') return;
          if(_isPlainObject(key)) {
            return Object.assign(...Object.entries(key).map(([k, v]) => ({[prefix+k]: v})));
          }
          return { [prefix === '' ? 'cols' : prefix.slice(0, -1)]: key};
        };
        return {
          ...keysToColAttributes(obj.schema.cols, '') || { cols: 12 },
          ...keysToColAttributes(obj.schema.offset, 'offset-'),
          ...keysToColAttributes(obj.schema.order, 'order-')
        };
      },
      getInputOn(obj) {
        const on = typeof obj['v-on'] !== 'undefined' ? obj['v-on'] : {};
        Object.keys(obj).forEach((key) => {
          if(key.indexOf('v-on:') === 0) {
            on[key.replace('v-on:', '')] = obj[key];
          }
        });
        return on;
      },
      getPropertyClassName (obj) {
        // get PROP specific name by app-/prepending 'appendix-' and replacing '.' with '-' in nested key path  -> 'controls switch'
        return obj.key ? obj.key.split('.').map(s => `prop-${s}`).join(' ') : ''
      },
      getClassName (obj) {
        // Combine all classes, example: class -> 'item type-checkbox key-address-zip prop-adress prop-zip'
        return `py-0 item type-${this.getType(obj)} key-${this.getKeyAsClass(obj)} ${this.getPropertyClassName(obj)}`;
      },
      // Map Values coming FROM Control or going TO Control
      toCtrl (params) {
        // manipulate value going to control, toCtrl-function must return a (modified) value
        // schema:{ name: { type:'text', toCtrl: ( {value} ) value && value.toUpperCase, ... }, ... }
        return _isFunction(params.obj.schema.toCtrl) ? params.obj.schema.toCtrl(params) : params.value
      },
      fromCtrl (params) {
        // manipulate updated value from control, fromCtrl-function must return a (modified) value
        // schema:{ name: { type:'text', fromCtrl: ( {value} ) value && value.toUpperCase, ... }, ... }
        return _isFunction(params.obj.schema.fromCtrl) ? params.obj.schema.fromCtrl(params) : params.value
      },
      // Radio options, sanitize item from array schema.options, ensure that the values are objects
      sanitizeRadioOption (v) {
        return _isString(v) ? { value: v, label: v } : v;
      },
      setValue (obj) {
        // Control gets a Value
        return this.toCtrl({ value: obj.value, obj, data: this.storeStateData, schema: this.storeStateSchema })
      },
      onColor (value, obj) {
        this.onInput(value.hex || false, obj);
      },
      // Get Value from Input & other Events
      onInput (value, obj) {

        // Value after change in Control
        value = this.fromCtrl({ value, obj, data: this.storeStateData, schema: this.storeStateSchema });

        // harmonize all empty strings to null, because clearable resets to null and not to empty string !!!
        value = value === '' ? null : value;

        // update deep nested prop(key) with value
        this.setObjectByPath(this.storeStateData, obj.key, value);
        this.updateArrayFromState(this.schema, this.value);

        // emit events
        this.emitValue('input', value);
      },
      // Event base
      emitValue (emit, val) {
          this.$emit(emit, val); // listen to specific event
          if ('inputclick'.indexOf(emit) > -1) this.$emit('change', val); // listen only to changes
          this.$emit('update', val); // all listen to events
      },

      // Update the value based on the dot-path
      setObjectByPath (object, path, value) {
        // resolves chained keys (like 'user.address.street') on an object and set the value
        const pathArray = path.split('.');
        let schema = this.schema;
        pathArray.forEach((p, ix) => {
          schema = schema[p];
          if (ix === pathArray.length - 1) {
            this.$set(object, p, value);
          } else if (typeof object[p] === 'undefined') {
            this.$set(object, p, Array.isArray(schema) ? [] : {});
          }
          object = object[p];
        });
      },
      updateArrayFromState (schema, data) {
        this.flatCombinedArray.forEach(obj => {
          obj.schema = _get(schema, obj.key, null); // get - lodash
          obj.value = _get(data, obj.key, null); // get - lodash
        });
      },
      // Flatten the schema
      flattenSchemaWithData (sch, dat) {
        const data = {};
        const schema = {};
        Object.keys(sch).forEach(i => {
          // If the 'type' property was found and is a string, we have an actual input field here, no nesting here.
          if (_isString(sch[i].type)) {
            console.debug(`Schema '${i}' input found`);
            data[i] = dat[i];
            schema[i] = sch[i];
          }
          // Check if the item is an object (nested) OR an array (nested)
          else if ((_isPlainObject(sch[i]) && !_isEmpty(sch[i])) || Array.isArray(sch[i])) {
            console.debug(`Schema '${i}' nested input found`);
            let { data: flatData, schema: flatSchema } = this.flattenSchemaWithData(sch[i], dat[i] || {});
            Object.keys(flatData).forEach(ii => {
              data[i + '.' + ii] = flatData[ii];
              schema[i + '.' + ii] = flatSchema[ii];
            });
          }
        });
        return { schema, data };
      },
      combineObjectsToArray ({ schema, data }) {
        const arr = [];
        Object.keys(data).forEach(key => {
          if (!_isPlainObject(schema[key])) {
            console.warn(`Prop '${key}' must have a correspondingly Property in Schema with at least ${key}:{ type:'text'} as value. Prop '${key}' is not editable and keeps untouched!`);
            return;
          }
          arr.push({ key, value: data[key], schema: schema[key] });
        });
        return arr;
      },
      flattenAndCombineToArray (data, schema) {
        const flattenedObjects = this.flattenSchemaWithData(schema, data);
        return this.combineObjectsToArray(flattenedObjects);
      },
    },
    created () {
      this.flatCombinedArray = this.flattenAndCombineToArray(this.value, this.schema);
    }
  }
</script>
