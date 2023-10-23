import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodePermissionManagerComponent } from './node-permission-manager.component';

describe('PermissionManagerComponent', () => {
  let component: NodePermissionManagerComponent;
  let fixture: ComponentFixture<NodePermissionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodePermissionManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodePermissionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
