import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/auth/auth.routes';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [AuthRedirectGuard],
        children: AUTH_ROUTES
    },
    {
        path: 'main',
        loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule)
    },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

    // Optional wildcard redirect
    { path: '**', redirectTo: '/auth/login' }
];
