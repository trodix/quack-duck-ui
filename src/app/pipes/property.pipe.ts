import { Pipe, PipeTransform } from '@angular/core';
import { Property } from 'src/app/model/node';

@Pipe({
  name: 'property'
})
export class PropertyPipe implements PipeTransform {

  transform(properties: Property[], propName: string): string | undefined {
    return properties.find(prop => prop.key === propName)?.value;
  }

}
