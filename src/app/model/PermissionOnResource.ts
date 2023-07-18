export interface PermissionOnResource {
  sub: string;
  obj: string;
  act: string;
}

export interface ExtendedPermission { permission: PermissionOnResource, hasPermission: boolean }
