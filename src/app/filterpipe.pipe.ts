import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterpipe'
})
export class FilterpipePipe implements PipeTransform {

  transform(value: any, search: any): any {
    return value.filter((e:any)=>{
      //console.log((e.nom.toLowerCase().indexOf(search) ) > -1 || (e.prenom.toLowerCase().indexOf(search)) > -1);
      return e.nom.toLowerCase().indexOf(search)  > -1 || e.prenom.toLowerCase().indexOf(search) > -1;
    });
    //return console.log(value);
  }

}
