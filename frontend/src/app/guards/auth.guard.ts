import {inject} from '@angular/core';
import { Router } from '@angular/router';

import { SessionStorageService } from "../services/session.storage.service";

export const authGuard = () => {
  const sessionStorageService = inject(SessionStorageService);
  const router = inject(Router);

  if (sessionStorageService.isLoggedIn()) {
    // dovolimo dostop do routov samo ce je user logiran
    return true;
  }
  console.log('not logged in, rerouting to login');
  // Redirect to the login page
  return router.parseUrl('/login');
};
