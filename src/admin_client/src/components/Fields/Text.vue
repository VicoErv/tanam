<template>
  <v-text-field
    :label="label"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Text'
    },
    value: {
      type: String,
      default: null
    }
  }
};
</script>
