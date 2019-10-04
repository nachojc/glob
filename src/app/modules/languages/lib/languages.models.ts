import { InjectionToken, Provider } from '@angular/core';

export const USE_MODULE = new InjectionToken<string>('USE_MODULE');
export const USE_ISOLATE = new InjectionToken<boolean>('USE_ISOLATE');
export interface LanguageModuleConfig {
    module?: string;
    loader?: Provider;
    isolate?: boolean;
    useDefaultLang?: boolean;
}
