import { TypePeriod } from "../enums/typePeriod.enum";

export interface Period{
  id?:number,
  entitled:string,
  typePeriod:'COURS_PERIOD' | 'INSCRIPTION_PERIOD' | 'EXAMENS_PERIOD' | 'VACANCES_PERIOD',
  startedAt:Date,
  endedAt:Date,
  academicId?: number,

}
