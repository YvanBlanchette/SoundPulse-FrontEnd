import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseImages',
  standalone: true
})
export class ParseImagesPipe implements PipeTransform {
  transform(value: string | any[]): any[] | null {
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      return JSON.parse(value);
    }
    return value as any[] || null;
  }
}