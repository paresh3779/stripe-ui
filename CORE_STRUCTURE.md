# Core Folder Structure Documentation

## Overview
This document describes the organization of the `src/app/core/` folder, which contains singleton services, interfaces, constants, and other core functionality used throughout the application.

## Directory Structure

```
core/
├── constants/          # Application-wide constants
├── guards/            # Route guards
├── interceptors/      # HTTP interceptors
├── interfaces/        # TypeScript interfaces (NEW)
├── models/            # Legacy re-exports (backward compatibility)
├── services/          # Singleton services
└── validators/        # Custom form validators
```

## Detailed Organization

### 📁 constants/
Contains all application constants including API endpoints, labels, and messages.

**Files:**
- `api-endpoints.ts` - All API endpoint definitions
  - AUTH endpoints (login, register, logout, etc.)
  - USERS endpoints (profile, change password, etc.)
  - STRIPE endpoints (checkout, promocode, coupon, webhook)
- `button-labels.ts` - Button text constants
- `form-labels.ts` - Form field label constants
- `page-headings.ts` - Page heading constants
- `validation-messages.ts` - Validation error messages and auth messages

**Usage Example:**
```typescript
import { API_ENDPOINTS } from '@core/constants/api-endpoints';

// Use endpoints
this.http.get(API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.PRODUCTS);
this.http.get(API_ENDPOINTS.USERS.GET_USER('123'));
```

### 📁 interfaces/
Contains all TypeScript interfaces organized by domain.

**Files:**
- `auth.interface.ts` - Authentication-related interfaces
  - `AuthTokens`, `LoginRequest`, `RegisterRequest`
  - `LoginResponse`, `RegisterResponse`, `RefreshTokenResponse`
  - `ForgotPasswordRequest`, `ResetPasswordRequest`

- `user.interface.ts` - User-related interfaces
  - `User`, `UserProfile`, `UpdateUserRequest`

- `stripe.interface.ts` - Stripe/payment-related interfaces
  - `Product`, `Price`, `Coupon`, `PromoCode`, `CheckoutSession`

- `api-response.interface.ts` - Generic API response types
  - `ApiResponse<T>`, `ApiErrorResponse`, `PaginatedResponse<T>`

- `index.ts` - Barrel export for convenient imports

**Usage Example:**
```typescript
// Import from specific file
import { User, UserProfile } from '@core/interfaces/user.interface';

// Or use barrel export
import { User, Product, LoginRequest } from '@core/interfaces';
```

### 📁 models/
**DEPRECATED** - Kept for backward compatibility only.

These files now re-export from `interfaces/` to maintain existing imports.
- `user.model.ts` → re-exports from `user.interface.ts`
- `auth-tokens.model.ts` → re-exports from `auth.interface.ts`

**Migration Path:**
- Old: `import { User } from '@core/models/user.model';`
- New: `import { User } from '@core/interfaces/user.interface';`

### 📁 services/
Contains singleton services (providedIn: 'root').

**Files:**
- `auth.service.ts` - Authentication operations
- `user.service.ts` - User management operations
- `stripe-checkout.service.ts` - Stripe checkout operations
- `token.service.ts` - Token management (Sanctum)
- `api-url.service.ts` - API URL construction
- `error-handling.service.ts` - Centralized error handling
- `notification.service.ts` - User notifications

**Best Practice:**
Services should NOT export interfaces. All interfaces belong in `interfaces/`.

### 📁 validators/
Custom Angular form validators.

**Files:**
- `password-strength.validator.ts` - Password strength validation
- `confirm-password.validator.ts` - Password confirmation matching

**Usage Example:**
```typescript
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';

this.form = this.fb.group({
  password: ['', [Validators.required, passwordStrengthValidator()]]
});
```

### 📁 guards/
Route guards for authentication and authorization.

**Files:**
- `auth.guard.ts` - Protects authenticated routes
- `auth-redirect.guard.ts` - Redirects authenticated users from auth pages

### 📁 interceptors/
HTTP interceptors for request/response handling.

**Files:**
- `auth.interceptor.ts` - Adds authentication to requests
- `error.interceptor.ts` - Global error handling

## Best Practices

### ✅ DO
- Place all interfaces in `core/interfaces/`
- Organize interfaces by domain (auth, user, stripe, etc.)
- Use barrel exports (`index.ts`) for convenient imports
- Keep API endpoints in `constants/api-endpoints.ts`
- Use validation messages from `constants/validation-messages.ts`
- Import interfaces from `@core/interfaces` (not from services)

### ❌ DON'T
- Export interfaces from service files
- Mix interfaces with implementation code
- Hardcode API endpoints in services
- Hardcode validation messages in components
- Create new files in `models/` folder (use `interfaces/` instead)

## Migration Guide

### For New Code
Always import from `interfaces/`:
```typescript
import { User, Product, LoginRequest } from '@core/interfaces';
```

### For Existing Code
Gradually migrate imports:
```typescript
// Old (still works but deprecated)
import { User } from '@core/models/user.model';

// New (preferred)
import { User } from '@core/interfaces/user.interface';
```

## API Endpoints Reference

### Authentication
```typescript
API_ENDPOINTS.AUTH.LOGIN           // 'login'
API_ENDPOINTS.AUTH.REGISTER        // 'register'
API_ENDPOINTS.AUTH.LOGOUT          // 'logout'
API_ENDPOINTS.AUTH.FORGOT_PASSWORD // 'forgot-password'
API_ENDPOINTS.AUTH.RESET_PASSWORD  // 'reset-password'
```

### Users
```typescript
API_ENDPOINTS.USERS.PROFILE           // 'users/profile'
API_ENDPOINTS.USERS.CHANGE_PASSWORD   // 'users/change-password'
API_ENDPOINTS.USERS.GET_USER(id)      // 'users/{id}'
```

### Stripe Checkout
```typescript
// Basic Checkout
API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.PRODUCTS       // 'stripe/checkout/basic/products'
API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.PRODUCT(id)    // 'stripe/checkout/basic/products/{id}'
API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.CREATE_SESSION // 'stripe/checkout/basic/create-session'

// Promo Code Checkout
API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.PRODUCTS       // 'stripe/checkout/promocode/products'
API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.VALIDATE       // 'stripe/checkout/promocode/validate-promocode'
API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.CREATE_SESSION // 'stripe/checkout/promocode/create-session'

// Coupon Checkout
API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.PRODUCTS       // 'stripe/checkout/coupon/products'
API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.COUPONS        // 'stripe/checkout/coupon/coupons'
API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.CREATE_SESSION // 'stripe/checkout/coupon/create-session'
```

## Validation Messages

All validation messages are centralized in `constants/validation-messages.ts`:

```typescript
import { VALIDATION_MESSAGES, AUTH_MESSAGES } from '@core/constants/validation-messages';

// Field validation messages
VALIDATION_MESSAGES.email.required    // 'Email is required.'
VALIDATION_MESSAGES.password.required // 'Password is required.'

// Auth messages
AUTH_MESSAGES.SUCCESS_MESSAGE.login   // 'Login successful.'
AUTH_MESSAGES.ERROR_MESSAGE[401]      // 'Unauthorized. Please login again.'
```

## Summary

The core folder is now properly organized with:
- ✅ All interfaces in dedicated `interfaces/` folder
- ✅ All API endpoints centralized in constants
- ✅ All validation messages centralized
- ✅ Clear separation of concerns
- ✅ Backward compatibility maintained
- ✅ Type-safe imports throughout the application
