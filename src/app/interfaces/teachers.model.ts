export interface Teacher {
  id: number; // L'ID est généré par le backend, il ne sera pas optionnel
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  telephone: string;

  birthday?: Date | string | null; // ou string si vous préférez le manipuler ainsi
  gender: 'MALE' | 'FEMALE';
  createdAt: Date; // ou string
}
