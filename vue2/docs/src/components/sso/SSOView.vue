<script setup>
import CustomStyling from './CustomStyling.vue';
import DefaultStyling from './DefaultStyling.vue';
import FailingSubmit from './FailingSubmit.vue';
import PresetSSOIdentifier from './PresetSSOIdentifier.vue';
import CodeSnippetDisplay from '../common/CodeSnippetDisplay.vue';
import { ref } from 'vue';
import CustomStylingCode from '../common/snippets/CustomStyling';
import DefaultStylingCode from '../common/snippets/DefaultStyling';
import PresetSSOIdentifierCode from '../common/snippets/PresetSSOIdentifier';
import FailingSubmitCode from '../common/snippets/FailingSubmit';

const customStylingCode = ref(CustomStylingCode);
const defaultStylingCode = ref(DefaultStylingCode);
const presetSSOIdentifierCode = ref(PresetSSOIdentifierCode);
const failingSubmitCode = ref(FailingSubmitCode);
</script>

<template>
  <div>
    <h2 style="margin-bottom: 48px">SSO Login Component Usage</h2>
    <h3 style="border-top: 1px solid #3c3c431f">With Custom Styles</h3>
    <CustomStyling></CustomStyling>
    <CodeSnippetDisplay>{{ customStylingCode }} </CodeSnippetDisplay>
    <h3>With default Styles</h3>
    <DefaultStyling></DefaultStyling>
    <CodeSnippetDisplay>{{ defaultStylingCode }} </CodeSnippetDisplay>
    <h3>Preset SSOIdentifier (No input display)</h3>
    <PresetSSOIdentifier></PresetSSOIdentifier>
    <CodeSnippetDisplay>{{ presetSSOIdentifierCode }} </CodeSnippetDisplay>
    <h3>With failing onSubmit</h3>
    <FailingSubmit></FailingSubmit>
    <CodeSnippetDisplay>{{ failingSubmitCode }} </CodeSnippetDisplay>
  </div>
</template>
<style scoped>
h3 {
  margin: 48px 0 16px;
  padding-top: 24px;
}
</style>
