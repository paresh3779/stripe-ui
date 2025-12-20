import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './modules/auth/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        children: AUTH_ROUTES
    },
    {
        path: 'main',
        loadChildren: () => import('./modules/layout/layout.module').then(m => m.LayoutModule)
    },
    { path: '', redirectTo: '/main', pathMatch: 'full' },

    // Optional wildcard redirect
    { path: '**', redirectTo: '/auth/login' }
];
