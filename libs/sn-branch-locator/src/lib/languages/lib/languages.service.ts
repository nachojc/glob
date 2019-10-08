import { Injectable, Optional, OnDestroy, InjectionToken, Inject } from '@angular/core';
import { LanguageStore } from './languages.storage';
import { LanguageLoader } from './languages.loader';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { USE_MODULE, USE_DEFAULT_LANG } from './languages.models';
import { HttpClientJsonpModule, HttpClient } from '@angular/common/http';

export abstract  class LanguageServiceClass {
    abstract setDefaultLang(lang: string): void;
    abstract use(lang: string, locally?: boolean): void;
    abstract getLangs(): Array<string>;
    abstract setLangs(langs: Array<string> | string): void;

}

export class LanguageService extends LanguageServiceClass implements OnDestroy {
    private _module: string;
    get module() { return this._module; }

    private _defaultLang;
    private _currentLang;
    private _localLang;
    private _langs = ['en'];
    private _langChangeSub: Subscription;

    constructor(
        private storage: LanguageStore,
        private loader: LanguageLoader,
        @Optional() @Inject(USE_DEFAULT_LANG) private DEFLANG: string = 'en',
        @Optional() @Inject(USE_MODULE) private MODULE_NAME: string = '',
        private call: HttpClient
        ) {
            super();
            this._defaultLang = DEFLANG;
            this._module = MODULE_NAME;
            this._langChangeSub = this.storage.onLanguageChange().subscribe( lang => {
                if (this._langs.includes(lang) && this._currentLang !== lang) {
                    this._currentLang = lang;
                    if (!this._localLang) {
                        this._loadData();
                    }
                } else if (!this._currentLang) {
                    this._currentLang = this._defaultLang;
                    this._loadData();
                }
            });
        }

    use(lang: string, locally = false) {
        if (locally) {
            this._localLang = lang;
            this._loadData.bind(this)();
        } else {
            this.storage.use(lang);
        }
    }
    setDefaultLang(lang: string) {
        this._defaultLang = lang;
    }

    public getLangs(): Array<string> {
        return this._langs;
    }
    public setLangs(langs: Array<string> | string): void {
        const ls = Array.isArray(langs) ? langs : typeof langs === 'string' ? [langs] : [];
        ls.forEach( l => {
            if (!this._langs.includes(l)) {
                this._langs.push('' + l) ;
            }
        });
    }








    private _loadData() {
        // this.loader.getTranslations(this._localLang || this._currentLang)
        //     .pipe(map(res => {
        //         const result = {module: this.module, data: res};
        //         return result;
        //     }));
        this.call.get(this.loader.getUrl(this._localLang || this._currentLang))
            .subscribe(data => {

                this.storage.setTranslations(this._module, data);
            });
    }
    ngOnDestroy(): void {
        this._langChangeSub.unsubscribe();
    }
}


export function LanguageServiceFactory(
    storage: LanguageStore,
    loader: LanguageLoader,
    DEFLANG: string,
    MODULE_NAME: string,
    http: HttpClient
    ) {
    return new LanguageService(storage, loader, DEFLANG, MODULE_NAME, http);
}
