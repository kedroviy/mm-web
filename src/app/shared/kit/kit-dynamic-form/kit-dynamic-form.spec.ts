import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { KitDynamicForm } from './kit-dynamic-form';
import { FormFieldConfig, FORM_COMPONENT_REGISTRY } from './form-factory.types';
import { KitInputComponent } from '@shared/kit/input/input';

@Component({
  imports: [KitDynamicForm],
  template: `<app-kit-dynamic-form [config]="config" />`,
})
class TestHostComponent {
  config: FormFieldConfig[] = [
    { key: 'name', label: 'Name', type: 'text' },
  ];
}

describe('KitDynamicForm', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: FORM_COMPONENT_REGISTRY, useValue: { text: KitInputComponent } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const dynamicForm = fixture.debugElement.children[0].componentInstance as KitDynamicForm;
    expect(dynamicForm).toBeTruthy();
  });

  it('should build form controls from config', () => {
    const dynamicForm = fixture.debugElement.children[0].componentInstance as KitDynamicForm;
    expect(dynamicForm.form.contains('name')).toBeTrue();
  });
});
