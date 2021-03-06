import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VSubheader,
  VCard,
  VMenu,
  VForm,
  VTextField,
  VRadioGroup,
  VCheckbox,
  VTextarea,
  VDialog,
  VTabs,
  VCombobox,
  VTooltip,
  VDatePicker,
  VTimePicker,
  VSelect,
  VSwitch,
  VDivider,
  VDataTable,
  VExpansionPanel,
  transitions
} from 'vuetify';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VSubheader,
    VCard,
    VMenu,
    VForm,
    VCombobox,
    VTooltip,
    VTextField,
    VCheckbox,
    VRadioGroup,
    VTextarea,
    VDialog,
    VTabs,
    VDatePicker,
    VTimePicker,
    VSelect,
    VSwitch,
    VDivider,
    VDataTable,
    VExpansionPanel,
    transitions
  },
  theme: {
    primary: '#4caf50'
  }
});
