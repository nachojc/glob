import { ModuleWithProviders, NgModule } from '@angular/core';
import { LanguageModuleConfig, USE_MODULE, USE_ISOLATE, USE_DEFAULT_LANG } from './lib/languages.models';
import { LanguageLoader, LanguageFakeLoader } from './lib/languages.loader';
import { LanguageService, LanguageServiceFactory } from './lib/languages.service';
import { LanguageStore } from './lib/languages.storage';
import { LanguageDirective } from './lib/languages.directive';
import { LanguagePipe } from './lib/languages.pipe';
import { HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [
        LanguagePipe,
        LanguageDirective
    ],
    exports: [
        LanguagePipe,
        LanguageDirective
    ]
})
export class LanguagesModule {
    static forRoot(config: LanguageModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: LanguagesModule,
            providers: [
                config.loader || {provide: LanguageLoader, useClass: LanguageFakeLoader},
                {provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang || 'en'},
                {provide: USE_MODULE, useValue: config.module || ''},
                {provide: USE_ISOLATE, useValue: config.module || false},
                {provide: LanguageService,
                    useFactory: LanguageServiceFactory,
                    deps: [
                        LanguageStore,
                        LanguageLoader,
                        USE_DEFAULT_LANG,
                        USE_MODULE,
                        HttpClient
                    ]
                },
                LanguageStore
            ]
        };
    }
    static forChild(config: LanguageModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: LanguagesModule,
            providers: [
                config.loader || {provide: LanguageLoader, useClass: LanguageFakeLoader},
                {provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang || 'en'},
                {provide: USE_MODULE, useValue: config.module || ''},
                {provide: USE_ISOLATE, useValue: config.module || false},
                // LanguageService,
                {provide: LanguageService,
                    useFactory: LanguageServiceFactory,
                    deps: [
                        LanguageStore,
                        LanguageLoader,
                        USE_DEFAULT_LANG,
                        USE_MODULE,
                        HttpClient
                    ]
                },
                LanguageStore
            ]
        };
    }
}
