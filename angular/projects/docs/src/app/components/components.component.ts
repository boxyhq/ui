import { Component } from '@angular/core';
import { Login } from '@boxyhq/angular-ui';

@Component({
  selector: 'app-components',
  template: `
    <h1>Hello world welcome to components</h1>
    <login [inputLabel]="'Team domain*'" [buttonText]="'LOGIN WITH SSO'"></login>
  `,
  standalone: true,
  imports: [Login],
  styleUrls: ['./components.component.css'],
})
export class ComponentsComponent {}
