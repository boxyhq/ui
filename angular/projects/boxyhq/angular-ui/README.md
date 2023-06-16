# @boxyhq/angular-ui

UI components from [BoxyHQ](https://boxyhq.com/) for plug-and-play enterprise features.

## Installation

`npm install @boxyhq/angular-ui --save`

## Usage

### SSO Login Component

There are mainly 2 ways of using the SSO Login Component as outlined below:

#### <ins>Preset value for `ssoIdentifier`</ins>

If a value is passed for `ssoIdentifier` input, it would render a button that on click calls the passed-in handler (onSubmit) with the `ssoIdentifier` value. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

```typescript
import { Login } from '@boxyhq/angular-ui/sso';
...
// app.module.ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, Login],
  providers: [],
  bootstrap: [AppComponent],
})
...
//app.component.ts
export class AppComponent {
customStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      borderColor: 'red',
    },
    button: {
      padding: '.85rem',
      marginLeft: '0',
    },
};
onSubmit = async function ({
    ssoIdentifier,
    cb,
  }: {
    ssoIdentifier: string;
    cb: (err: { error: { message: string } } | null) => void;
  }) {
    console.log(ssoIdentifier);
    // Initiate SSO flow
    // In case of error initiating the flow, invoke callback with error object
    cb({
      error: {
        message: 'Invalid team domain',
      },
    });
  };
}
...
//app.component.html
<login
  buttonText="Login with SSO"
  placeholder="contoso@boxyhq.com"
  [ssoIdentifier]="'tenant='+tenant+'&product='+product"
  (onSubmit)="onSSOSubmit($event)"
  [styles]="customStyles"
/>;
```

#### <ins>Accept input from the user for `ssoIdentifier`</ins>

If a value is not passed for `ssoIdentifier`, it would render an input field for the user to enter the `ssoIdentifier` value. And then on submit, the value gets passed to the handler. The handler can then initiate a redirect to the SSO service forwarding the value for ssoIdentifier.

```typescript
...
// app.module.ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, Login],
  providers: [],
  bootstrap: [AppComponent],
})
...
//app.component.ts
export class AppComponent {
onSSOSubmit = async function ({
    ssoIdentifier,
    cb,
  }: {
    ssoIdentifier: string;
    cb: (err: { error: { message: string } } | null) => void;
  }) {
    console.log(ssoIdentifier);
    // Initiate SSO flow
    // In case of error initiating the flow, invoke callback with error object
    cb({
      error: {
        message: 'Invalid team domain',
      },
    });
  };
}
...

//app.component.html
<login
  buttonText="Login with SSO"
  placeholder="contoso@boxyhq.com"
  onSubmit="onSSOSubmit($event)"
  />;
```

#### Styling

If the `classNames` input is passed in, we can override the default styling for each inner element. In case an inner element is omitted from the `classNames` input, default styles will be set for the element.
**NOTE**: At the moment sourcing the CSS classnames using `styleUrls` won't work due to ViewEncapsulation. You can keep the class names in a global stylesheet.

Styling via styles attribute is supported for each inner element.

```typescript
...
//app.component.ts
export class AppComponent {
customStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      borderColor: 'red',
    },
    button: {
      padding: '.85rem',
      marginLeft: '0',
    },
    label: {
      fontWeight: '500'
    }
};

customStyleClasses = {
    button: 'btn',
    input: 'inp',
  };
}
...
//app.component.html
<login
  buttonText="Login with SSO"
  placeholder="contoso@boxyhq.com"
  (onSubmit)="onSSOSubmit($event)"
  [styles]="customStyles"
  [classNames]="customStyleClasses"
/>;
```
