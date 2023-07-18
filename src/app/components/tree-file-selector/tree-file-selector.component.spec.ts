import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeFileSelectorComponent } from './tree-file-selector.component';

describe('TreeFileSelectorComponent', () => {
  let component: TreeFileSelectorComponent;
  let fixture: ComponentFixture<TreeFileSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeFileSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeFileSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
