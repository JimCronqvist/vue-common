import { Model as BaseModel } from 'vue-api-query'
import axios from 'axios';

BaseModel.$http = axios;

export default class AbstractModel extends BaseModel {

  // Improve the pluralization of the default guess of a resource name
  resource() {
    const name = this.constructor.name.toLowerCase();
    return name.substr(-1) === 'y' ? `${name.slice(0, -1)}ies` : `${name}s`;
  }

  // Implement a default request method using axios
  request (config) {
    return this.$http.request(config)
  }

  constructor(...attributes) {
    const self = super(...attributes);
  }

  relations() {
    return {};
  }

  transformRelations(model) {
    if(!(typeof model.relations === 'function')){
      return model;
    }
    for(const [key, value] of Object.entries(model.relations())) {
      if(Array.isArray(model[key])) {
        model[key] = model[key].map(obj => this.transformRelations(new value(obj)));
      } else if(typeof model[key] === 'object' && model[key] !== null) {
        model[key] = this.transformRelations(new value(model[key]));
      }
    }
    return model;
  }

  $find(id) {
    return super.$find(id)
      .then(response => {
        return this.transformRelations(response);
      });
  }

  $first() {
    return super.$first()
      .then(response => {
        return this.transformRelations(response);
      });
  }

  $get() {
    return super.$get()
      .then(response => {
        return response.map(obj => this.transformRelations(obj));
      });
  }

  _create() {
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data: this
    }).then(response => {
      let self = Object.assign(this, response.data.data || response.data);
      return self;
    })
  }

  _update() {
    return this.request({
      method: 'PUT',
      url: this.endpoint(),
      data: this
    }).then(response => {
      let self = Object.assign(this, response.data.data || response.data);
      return self;
    })
  }

  disableErrorHandleInterceptor() {
    return this.config({ errorHandle: false} );
  }

  clone(setAttributes = {}, additionalExceptAttributes = []) {
    const setAttributesKeys = Object.keys(setAttributes);
    const exceptAttributes = additionalExceptAttributes.push(setAttributes);
    const attributes = exceptAttributes.length > 0
      ? this.getAttributes().filter(except => !exceptAttributes.includes(except))
      : this.getAttributes();

    const newObj = new this.constructor(attributes);
    for(const relation of Object.keys(newObj.relations())) {
      if(newObj.hasOwnProperty(relation)) {
        if(Array.isArray(newObj[relation])) {
          newObj[relation] = newObj[relation].map(relObj => relObj.clone());
        } else {
          newObj[relation] = newObj[relation].clone();
        }
      }
    }

    if(setAttributesKeys.length > 0) {
      Object.assign(newObj, setAttributes);
    }

    return newObj;
  }

  getAttributes() {
    const attributes = {};
    for(const key of Object.keys(this)) {
      attributes[key] = this[key];
    }
    return attributes;
  }
}
