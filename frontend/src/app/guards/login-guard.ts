import {inject} from '@angular/core';
import { Router } from '@angular/router';

import  { AuthService } from "../services/auth.service";
import {map, take} from "rxjs/operators";

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn
  .pipe(
    take(1),
    map((isLoggedIn: boolean) => {
      if (!isLoggedIn){
        return true;
      }
      router.navigate(['/home']);
      return false;
    }));
};
