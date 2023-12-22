import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeInfoViewerComponent } from './node-info-viewer.component';

describe('NodeInfoViewerComponent', () => {
  let component: NodeInfoViewerComponent;
  let fixture: ComponentFixture<NodeInfoViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeInfoViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeInfoViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
