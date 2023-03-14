export interface DNode {
  uuid: string;
  bucket: string;
  directoryPath: string;
  versions: number;
  type: string;
  aspects: string[];
  properties: Property[];
}

export interface Property {
  key: string, 
  value: string 
}
