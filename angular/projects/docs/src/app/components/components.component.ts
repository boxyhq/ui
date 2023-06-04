import { Component } from '@angular/core';
import { Login } from '@boxyhq/angular-ui';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-components',
  template: `
    <app-navbar></app-navbar>
    <login [inputLabel]="'Team domain*'" [buttonText]="'LOGIN WITH SSO'"></login>
  `,
  standalone: true,
  imports: [CommonModule, NavbarComponent, Login],
  styleUrls: ['./components.component.css'],
})
export class ComponentsComponent {}
