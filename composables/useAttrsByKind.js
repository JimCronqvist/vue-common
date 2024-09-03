import omitBy from 'lodash/omitBy';
import { computed, useAttrs } from 'vue';

/**
 * Extract the attributes from the component and separate them by kind. Useful when you want to pass the attributes to
 * a child component, and you want to separate the attributes by kind.
 *
 * Please keep in mind that 'inheritAttrs' should be set to false in the child component if you want to avoid unexpected
 * inheritance of attributes. Such as listeners being inherited by the root element.
 *
 * @returns {{attributes: *, listeners: *, styleClassAttributes: *}}
 */

export function useAttrsByKind() {
  const attrs = useAttrs();

  const attributes = computed(() => {
    return omitBy(attrs, (value, key) => key === 'class' || key === 'style' || key.match(/^on[A-Z]/));
  });

  const listeners = computed(() => {
    return omitBy(attrs, (value, key) => !key.match(/^on[A-Z]/));
  });

  const styleClassAttributes = computed(() => {
    return omitBy(attrs, (value, key) => key !== 'class' && key !== 'style');
  });

  return { attributes, listeners, styleClassAttributes };
}
