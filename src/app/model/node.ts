export interface DNode {
  id: number;
  bucket: string;
  parentId: number;
  versions: number;
  type: string;
  path: NodePath[]
  tags: string[];
  properties: Property[];
  children: DNode[];
}

export interface CreateNode {
  parentId: number;
  type: string;
  tags: string[];
  properties: Property[];
}

export interface NodePath {
  nodeId: number;
  nodeName: string;
}

export interface DNodeDirRequest {
  directoryPath: string;
  bucket?: string;
  properties: any[];
}

export interface Property {
  key: string, 
  value: string 
}

export const ContentModel = {
  TYPE_CONTENT: "cm:content",
  TYPE_DIRECTORY: "cm:directory"
}
