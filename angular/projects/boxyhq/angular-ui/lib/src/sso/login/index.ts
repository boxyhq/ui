import { Output, EventEmitter, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

import type { LoginProps } from "./types";
import getUniqueId from "./utils/getUniqueId";
import cssClassAssembler from "./utils/cssClassAssembler";
const COMPONENT = "sso";
const DEFAULT_VALUES = {
  ssoIdentifier: "",
  inputLabel: "Tenant",
  placeholder: "",
  buttonText: "Sign-in with SSO",
};

@Component({
  selector: "login, Login",
  template: `
    <div [ngStyle]="styles?.container" [class]="classes.container">
      <ng-container *ngIf="shouldRenderInput">
        <label
          [attr.for]="InputId"
          [ngStyle]="styles?.label"
          [class]="classes.label"
        >
          {{inputLabel || DEFAULT_VALUES.inputLabel}}
        </label>

        <input
          [attr.id]="InputId"
          [attr.value]="_ssoIdentifier"
          [attr.placeholder]="placeholder || DEFAULT_VALUES.placeholder"
          (input)="handleChange($event)"
          [ngStyle]="styles?.input"
          [class]="classes.input"
          [attr.aria-invalid]="isError"
          [attr.aria-describedby]="ErrorSpanId"
        />

        <ng-container *ngIf="isError">
          <span [attr.id]="ErrorSpanId">{{errMsg}}</span>
        </ng-container>
      </ng-container>

      <button
        type="button"
        [attr.disabled]="disableButton"
        (click)="onSubmitButton($event)"
        [ngStyle]="styles?.button"
        [class]="classes.button"
      >
        {{buttonText || DEFAULT_VALUES.buttonText}}
      </button>
    </div>
  `,
  standalone: true,
  styleUrls: ['../../../login.component.css'],
  imports: [CommonModule],
})
export class Login {
  DEFAULT_VALUES = DEFAULT_VALUES;

  @Input() ssoIdentifier: LoginProps["ssoIdentifier"];
  @Input() classNames: LoginProps["classNames"];
  @Input() styles: LoginProps["styles"];
  @Input() innerProps: LoginProps["innerProps"];
  @Input() inputLabel: LoginProps["inputLabel"];
  @Input() placeholder: LoginProps["placeholder"];
  @Input() buttonText: LoginProps["buttonText"];

  @Output() onSubmit = new EventEmitter();

  _ssoIdentifier = DEFAULT_VALUES.ssoIdentifier;
  errMsg = "";
  isProcessing = false;
  get isError() {
    return !!this.errMsg;
  }
  get shouldRenderInput() {
    return !this.ssoIdentifier;
  }
  get InputId() {
    return getUniqueId(COMPONENT, "input");
  }
  get ErrorSpanId() {
    return getUniqueId(COMPONENT, "span");
  }
  get disableButton() {
    return !(this._ssoIdentifier || this.ssoIdentifier) || null;
  }
  get classes() {
    return {
      container: cssClassAssembler(this.classNames?.container),
      label: cssClassAssembler(this.classNames?.label),
      input: cssClassAssembler(this.classNames?.input),
      button: cssClassAssembler(this.classNames?.button),
    };
  }
  handleChange(event: Event) {
    this.errMsg = "";
    this._ssoIdentifier = (event.currentTarget as HTMLInputElement)?.value;
  }
  onSubmitButton(event: Event) {
    event.preventDefault();
    this.isProcessing = true;
    const ssoIdentifierToSubmit =
      (this._ssoIdentifier || this.ssoIdentifier) ?? "";
    this.onSubmit.emit({
      ssoIdentifierToSubmit,
      cb(
        err: {
          error: {
            message: string;
          };
        } | null
      ) {
        this.isProcessing = false;
        if (err?.error.message) {
          this.errMsg = err.error.message;
        }
      },
    });
  }
}
