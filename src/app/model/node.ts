export interface DNode {
  uuid: string;
  bucket: string;
  directoryPath: string;
  versions: number;
  type: string;
  aspects: string[];
  properties: Property[];
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
