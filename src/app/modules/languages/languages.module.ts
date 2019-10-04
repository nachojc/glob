import { ModuleWithProviders, NgModule } from '@angular/core';
import { LanguageModuleConfig, USE_MODULE, USE_ISOLATE } from './lib/languages.models';
import { LanguageLoader, LanguageFakeLoader } from './lib/languages.loader';
import { LanguageService } from './lib/languages.service';
import { LanguageStore } from './lib/languages.storage';

@NgModule({
    declarations: [
    //   TranslatePipe,
    //   TranslateDirective
    ],
    exports: [
    //   TranslatePipe,
    //   TranslateDirective
    ]
})
export class LanguagesModule {
    static forRoot(config: LanguageModuleConfig = {}): ModuleWithProviders {
        return {
            ngModule: LanguagesModule,
            providers: [
                config.loader || {provide: LanguageLoader, useClass: LanguageFakeLoader},
                {provide: USE_MODULE, useValue: config.module || ''},
                {provide: USE_ISOLATE, useValue: config.module || false},
                LanguageService,
                LanguageStore
            ]
        };
    }
    static forChild() {
        return {
            ngModule: LanguagesModule
        };
    }
}
