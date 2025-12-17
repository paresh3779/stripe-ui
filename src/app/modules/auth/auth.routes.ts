import { Routes } from "@angular/router";
import { AuthRedirectGuard } from "../../core/guards/auth-redirect.guard";

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./layout/auth-layout/auth-layout').then(m => m.AuthLayout),    
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/login/login').then(m => m.Login),
                canActivate: [AuthRedirectGuard]
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/register/register').then(m => m.Register),
                canActivate: [AuthRedirectGuard]
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword),
                canActivate: [AuthRedirectGuard]
            },
            {
                path: 'reset-password/:token',
                loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPassword),
                canActivate: [AuthRedirectGuard]
            },
        ]
    }               
]