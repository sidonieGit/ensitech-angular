// src/app/interfaces/country-code.interface.ts

export interface CountryCode {
  name: string;
  code: string; // ex: '+237'
  minLength?: number; // Longueur minimale du numéro local (sans l'indicatif)
  maxLength?: number; // Longueur maximale du numéro local (sans l'indicatif)
}
