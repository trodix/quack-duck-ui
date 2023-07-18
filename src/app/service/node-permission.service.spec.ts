import { TestBed } from '@angular/core/testing';

import { NodePermissionService } from './node-permission.service';

describe('NodePermissionService', () => {
  let service: NodePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
