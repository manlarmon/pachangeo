import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]

})
export class CustomInputComponent implements OnInit, ControlValueAccessor {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  @Input() placeholder!: any;
  @Input() labelPlacement!: string;

  // Valor interno del input
  value: any = '';

  isPassword!: boolean;
  hidePassword!: boolean;

  // Funciones que serán llamadas por Angular
  onChange = (value: any) => { };
  onTouched = () => { };

  constructor() { }

  ngOnInit() {
    if (this.type === 'password') {
      this.isPassword = true;
    }
  }

  showPassword() {
    this.hidePassword = !this.hidePassword;

    if (this.hidePassword) {
      this.type = 'password';
    } else {
      this.type = 'text';
    }
  }

  // Implementación de ControlValueAccessor
  // Las agrego debido a un error "No value accessor for form control name: 'password " 


  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    //maneja el estado de deshabilitado del input
  }

}
