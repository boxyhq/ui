# @boxyhq/vue2-ui

UI components from [BoxyHQ](https://boxyhq.com/) for plug-and-play enterprise features.

## Installation

`npm install @boxyhq/vue2-ui --save`

## Usage

### SSO Login Component

There are mainly 2 ways of using the SSO Login Component as outlined below:

#### Preset value for `ssoIdentifier`

If a value is passed for `ssoIdentifier`, it would render a button that on click calls the passed-in handler (onSubmit) with the `ssoIdentifier` value. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

#### Accept input from the user for `ssoIdentifier`

If a value is not passed for `ssoIdentifier`, it would render an input field for the user to enter the `ssoIdentifier` value. And then on submit, the value gets passed to the handler. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

#### Styling

If the classNames prop is passed in, we can override the default styling for each inner element. In case an inner element is omitted from the classNames prop, default styles will be set for the element. For example, In the below snippet, all the inner elements are styled by passing in the classNames for each inner one.

Styling via style attribute is also supported for each inner element.
