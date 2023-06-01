<template>
  <div>
    <CustomStyling></CustomStyling>
    <DefaultStyling></DefaultStyling>
    <PresetSSOIdentifier></PresetSSOIdentifier>
    <FailingSubmit></FailingSubmit>
  </div>
</template>
<script>
import CustomStyling from './CustomStyling.vue';
import DefaultStyling from './DefaultStyling.vue';
import FailingSubmit from './FailingSubmit.vue';
import PresetSSOIdentifier from './PresetSSOIdentifier.vue';

export default {
  name: 'SSOView',
  components: {
    CustomStyling,
    DefaultStyling,
    PresetSSOIdentifier,
    FailingSubmit,
  },
};
</script>
