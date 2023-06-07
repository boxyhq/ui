---
outline: deep
---

# SSO Login Component Usage

<script setup>
import CustomStyling from './sso/CustomStyling.vue'
import DefaultStyling from "./sso/DefaultStyling.vue"
import PresetSSOIdentifier from "./sso/PresetSSOIdentifier.vue"
import FailingSubmit from "./sso/FailingSubmit.vue"
</script>

## With custom styling

  <CustomStyling/>

<<< @/components/sso/CustomStyling.vue

## With default styles

 <DefaultStyling/>

<<< @/components/sso/DefaultStyling.vue

## Without input display

 <PresetSSOIdentifier/>

<<< @/components/sso/PresetSSOIdentifier.vue

## With failing onSubmit

 <FailingSubmit/>

<<< @/components/sso/FailingSubmit.vue
