import { Injectable } from '@angular/core';
import { CountryCode } from 'src/app/interfaces/country-code.interface';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  getAllCountries(): any[] {
    return this.countryCodes;
  }
  readonly defaultCountryCode = '+237';

  readonly countryCodes: CountryCode[] = [
    { name: 'Cameroun', code: '+237', minLength: 8, maxLength: 9 },
    { name: 'France', code: '+33', minLength: 9, maxLength: 9 },
    { name: 'Bénin', code: '+229', minLength: 8, maxLength: 8 },
    { name: 'Mauritanie', code: '+222', minLength: 8, maxLength: 8 },
    { name: 'Congo', code: '+242', minLength: 9, maxLength: 9 },
    { name: 'Île Maurice', code: '+230', minLength: 7, maxLength: 8 },
    { name: 'Maroc', code: '+212', minLength: 9, maxLength: 9 },
    { name: 'Gabon', code: '+241', minLength: 8, maxLength: 8 },
    { name: 'RDC', code: '+243', minLength: 9, maxLength: 9 },
    { name: 'Guinée', code: '+224', minLength: 8, maxLength: 9 },
    { name: 'Togo', code: '+228', minLength: 8, maxLength: 8 },
  ];

  constructor() {}

  /*normalize(
    raw: string | undefined | null,
    selectedCountryCode: string = this.defaultCountryCode
  ): string {
    if (!raw) return '';

    let s = String(raw).trim();
    const numericCountryCode = selectedCountryCode.replace('+', '');

    if (s.startsWith('+')) {
      const digits = s.slice(1).replace(/\D+/g, '');
      return '+' + digits;
    }

    s = s.replace(/\D+/g, '');
    if (s.startsWith(numericCountryCode)) {
      return '+' + s;
    }

    return selectedCountryCode + s;
  }*/
  /**
   * Nettoie le numéro en retirant les espaces et les caractères non numériques.
   * Conserve le '+' uniquement s'il est le premier caractère.
   * @param raw La chaîne de téléphone brute.
   * @returns La chaîne nettoyée.
   */
  private sanitize(raw: string): string {
    if (!raw) return '';
    // Retire les espaces
    let s = raw.trim().replace(/\s+/g, '');

    // S'il y a un '+' au début, on le garde pour l'indicatif.
    if (s.startsWith('+')) {
      // On garde le '+' puis on retire tous les non-chiffres du reste de la chaîne
      return '+' + s.slice(1).replace(/\D/g, '');
    }
    // Sinon, on retire tous les non-chiffres de toute la chaîne
    return s.replace(/\D/g, '');
  }
  // normalize(raw: string, countryCode: string): string {
  //   if (!raw) return '';

  //   let s = raw.trim().replace(/\s+/g, '');
  //   s = s.replace(/^0+/, ''); // retire les 0 au début si présents

  //   // Si l'utilisateur a déjà mis un indicatif (+33, +229, etc.), on garde tel quel
  //   if (s.startsWith('+')) return s;

  //   // Si l'utilisateur a saisi le code sans +, on l'ajoute
  //   const numericCountry = countryCode.replace('+', '');
  //   if (s.startsWith(numericCountry)) return `+${s}`;

  //   // Sinon on préfixe avec le code sélectionné
  //   return `${countryCode}${s}`;
  // }

  normalize(raw: string, countryCode: string): string {
    if (!raw) return '';

    // Utilisation de la nouvelle fonction de nettoyage
    let s = this.sanitize(raw);
    s = s.replace(/^0+/, ''); // retire les 0 au début (convention africaine/européenne)

    // Si l'utilisateur a déjà mis un indicatif (+33, +229, etc.), on garde tel quel
    if (s.startsWith('+')) return s;

    // Si l'utilisateur a saisi le code sans +, on l'ajoute
    const numericCountry = countryCode.replace('+', '');
    if (s.startsWith(numericCountry)) return `+${s}`;

    // Sinon on préfixe avec le code sélectionné
    return `${countryCode}${s}`;
  }

  splitPhone(fullPhone: string): { code: string; number: string } {
    if (!fullPhone) return { code: this.defaultCountryCode, number: '' };
    const found = this.countryCodes.find((c) => fullPhone.startsWith(c.code));
    if (!found) return { code: this.defaultCountryCode, number: fullPhone };
    const local = fullPhone.slice(found.code.length);
    return { code: found.code, number: local };
  }

  prettyPrint(normalized: string): string {
    if (!normalized) return '';
    const clean = normalized.replace(/\s+/g, '');
    return clean.replace(/^(\+\d{1,3})(\d+)/, '$1 $2');
  }

  private formatNumber(code: string, local: string, groups: number[]): string {
    const parts: string[] = [];
    let index = 0;
    for (const size of groups) {
      parts.push(local.substring(index, index + size));
      index += size;
      if (index >= local.length) break;
    }
    if (index < local.length) parts.push(local.substring(index));
    return `${code} ${parts.join(' ')}`;
  }

  validateLength(
    phone: string | undefined | null,
    countryCode: string
  ): boolean {
    if (!phone) return false;
    const countryRule = this.countryCodes.find((c) => c.code === countryCode);
    if (!countryRule) return false;

    const numericPhone = phone.replace(/\D/g, '');
    const numericCountryCode = countryCode.replace('+', '');
    let localNumberDigits = numericPhone.startsWith(numericCountryCode)
      ? numericPhone.substring(numericCountryCode.length)
      : numericPhone;

    return (
      localNumberDigits.length >= (countryRule.minLength ?? 0) &&
      localNumberDigits.length <= (countryRule.maxLength ?? Infinity)
    );
  }

  /*validateLength(phone: string, countryCode: string): boolean {
    const country = this.countries.find((c) => c.code === countryCode);
    if (!country) return false;
    const digits = phone.replace(/\D+/g, '');
    return digits.length >= country.minLength && digits.length <= country.maxLength;
  }*/

  getPhoneLengthRule(countryCode: string): number {
    const country = this.countryCodes.find((c) => c.code === countryCode);
    return country?.minLength ?? 8;
  }

  detectCountryCode(normalizedPhone: string): string | undefined {
    if (!normalizedPhone || !normalizedPhone.startsWith('+')) return undefined;
    const sortedCodes = [...this.countryCodes].sort(
      (a, b) => b.code.length - a.code.length
    );
    return sortedCodes.find((c) => normalizedPhone.startsWith(c.code))?.code;
  }
}
