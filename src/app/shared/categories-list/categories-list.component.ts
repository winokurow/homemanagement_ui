import {Component, forwardRef, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {Category} from "../category";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoriesListComponent),
      multi: true
    }
  ]
})
export class CategoriesListComponent  implements ControlValueAccessor  {

  enumOptions = Object.keys(Category);
  enumValues: { [key: string]: number } = {};

  value: string;

  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() {
    // Initialize enumValues with default values or values from a service.
    for (const option of this.enumOptions) {
      this.enumValues[option] = 0;
    }
  }

  onChanges() {
    console.log('ngOnChanges - myProp = ');

    const tempString = Object.entries(this.enumValues).filter(([key, value]) => value !=0)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');


    this.onChange(tempString);
  }

  writeValue(value: string): void {
    this.value = value;
      if (value) {
        // Split the input string by semicolon to get individual key-value pairs.
        const keyValuePairs = this.value.split(';');

        // Iterate through the key-value pairs and split them by colon to create the object.
        for (const pair of keyValuePairs) {
          const [key, value] = pair.split(':');
          this.enumValues[key] = parseInt(value);
        }
      }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
