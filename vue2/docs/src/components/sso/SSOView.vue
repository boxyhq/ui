<template>
  <div>
    <h2>SSO Login Component Usage</h2>
    <h3 style="border-top: 1px solid #3c3c431f">With Custom Styles</h3>
    <CustomStyling></CustomStyling>
    <h3>With default Styles</h3>
    <DefaultStyling></DefaultStyling>
    <h3>Preset SSOIdentifier (No input display)</h3>
    <PresetSSOIdentifier></PresetSSOIdentifier>
    <h3>With failing onSubmit</h3>
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
