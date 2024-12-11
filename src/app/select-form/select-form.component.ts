import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        query(
          'mat-card',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class SelectFormComponent {

  dynamicForm: FormGroup = this.fb.group({});
  jsonData: any = null;
  jsonFiles = ['data-a', 'data-b'];
  selectedFile = '';

  constructor(private fb: FormBuilder, private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.selectedFile = this.jsonFiles[0];
    this.onFileChange();
  }

  onFileChange(): void {
    this.dataService.loadJson(this.selectedFile + '.json').subscribe((data) => {
      this.jsonData = data;
      this.dynamicForm = this.buildForm(data);
      this.cdr.detectChanges();
    });
  }

  buildForm(data: any): FormGroup {
    const group: any = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (Array.isArray(value)) {
        if (value.every((item) => typeof item !== 'object')) {
          group[key] = new FormControl(value[0] || null);
        } else {
          group[key] = this.fb.array(value.map((item) => this.buildForm(item)));
        }
      } else if (typeof value === 'object' && value !== null) {
        group[key] = this.buildForm(value);
      } else {
        group[key] = new FormControl(value);
      }
    });
    return this.fb.group(group);
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isPrimitive(value: any): boolean {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
  }

  isPrimitiveArray(value: any): boolean {
    return Array.isArray(value) && value.every((item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean');
  }

  isFormGroup(control: any): boolean {
    return control instanceof FormGroup;
  }
  isFormArray(control: any): boolean {
    return control instanceof FormArray;
  }

  getFormArrayControls(control: any): FormGroup[] {
    return control?.controls || [];
  }

  onSubmit(): void {
    console.log(this.dynamicForm.value);
  }
}
