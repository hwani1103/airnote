import { User } from '@prisma/client';

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export interface LoginUser {
  ok: boolean;
  profile: User;
}