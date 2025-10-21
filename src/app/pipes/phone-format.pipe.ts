import { Pipe, PipeTransform } from '@angular/core';
import { PhoneService } from '../services/phone/phone.service';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  constructor(private phoneService: PhoneService) {}

  /**
   * transform(value, pretty = true)
   * - pretty=true -> affiche une version lisible (prettyPrint)
   * - pretty=false -> retourne la version normalisée (ex: +237671234567)
   */
  transform(value: string): string {
    return this.phoneService.prettyPrint(value);
  }
}
