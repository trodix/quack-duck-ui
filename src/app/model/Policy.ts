export interface Policy {
  sub: string;
  obj: string;
  act: string;
}

export interface ExtendedPermission { policy: Policy, hasPermission: boolean }
export interface GroupingPolicy { group: string, role: string }
