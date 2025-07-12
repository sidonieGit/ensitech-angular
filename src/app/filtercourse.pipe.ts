import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtercourse'
})
export class FiltercoursePipe implements PipeTransform {

  transform(value: any, search: any): any {
    return value.filter((e: any) => {
      return e.id.toLowerCase().indexOf(search) > -1 || e.theme.toLowerCase().indexOf(search) > -1;
    });
  }
}
