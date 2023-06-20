# @boxyhq/svelte-ui

UI components from [BoxyHQ](https://boxyhq.com/) for plug-and-play enterprise features.

## Installation

`npm install @boxyhq/svelte-ui --save`

## Usage

### SSO Login Component

There are mainly 2 ways of using the SSO Login Component as outlined below:

#### Preset value for `ssoIdentifier`

If a value is passed for `ssoIdentifier`, it would render a button that on click calls the passed-in handler (onSubmit) with the `ssoIdentifier` value. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

```svelte
<script>
	import { Login } from '@boxyhq/svelte-ui/sso';

	const onSSOSubmit = async ({ ssoIdentifier }) => {
		// initiate the SSO flow here
		console.log(ssoIdentifier);
	};
</script>

<Login
	buttonText={'Login with SSO'}
	ssoIdentifier={`tenant=${tenant}&product=${product}`}
	onSubmit={onSSOSubmit}
	classNames={{
		container: 'mt-2',
		button: 'btn-primary btn-block btn rounded-md active:-scale-95'
	}}
/>;
```

#### Accept input from the user for `ssoIdentifier`

If a value is not passed for `ssoIdentifier`, it would render an input field for the user to enter the `ssoIdentifier` value. And then on submit, the value gets passed to the handler. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

```svelte
<script>
	import { Login } from '@boxyhq/svelte-ui/sso';

	const onSSOSubmit = async ({ ssoIdentifier }) => {
		// initiate the SSO flow here
		console.log(ssoIdentifier);
	};
</script>

<Login
	buttonText={'Login with SSO'}
	onSubmit={onSSOSubmit}
	classNames={{
		container: 'mt-2',
		label: 'text-gray-400',
		button: 'btn-primary btn-block btn rounded-md active:-scale-95',
		input: 'input-bordered input mb-5 mt-2 w-full rounded-md'
	}}
/>;
```

#### Styling

If the classNames prop is passed in, we can override the default styling for each inner element. In case an inner element is omitted from the classNames prop, default styles will be set for the element.
**NOTE**: At the moment sourcing the CSS class names using component level`<style>` won't work due to scoping. You can keep the class names in a global stylesheet.

Styling via styles attribute is also supported for each inner element.

```svelte
<Login
	buttonText={'Login with SSO'}
	onSubmit={onSSOSubmit}
	classNames={{
		container: 'mt-2',
		label: 'text-gray-400',
		button: 'btn-primary btn-block btn rounded-md active:-scale-95',
		input: 'input-bordered input mb-5 mt-2 w-full rounded-md'
	}}
/>
```
