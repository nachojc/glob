import { Injectable, Optional, OnDestroy } from '@angular/core';
import { LanguageStore } from './languages.storage';
import { LanguageLoader } from './languages.loader';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable()
export class LanguageService implements OnDestroy {
    private _module: string;
    get module() { return this._module; }

    private _defaultLang = 'en';
    private _currentLang = 'en';
    private _langChangeSub: Subscription;

    constructor(
        private storage: LanguageStore,
        private http: LanguageLoader,
        @Optional() @Injectable() USE_MODULE: string = ''
        ) {
            this._module = USE_MODULE;
            this._langChangeSub = this.storage.onLanguageChange().subscribe( lang => {
                this._currentLang = lang;
                this._loadData();
            });
        }

    use(lang: string, locally = false) {
        if (locally) {
            this._currentLang = lang;
            this._loadData();
        } else {
            this.storage.use(lang);
        }
    }
    setDefaultLang(lang: string) {
        this._defaultLang = lang;
    }

    private _loadData() {
        this.http.getTranslate(this._currentLang).pipe(map(res => {
            const result = {module: this.module, data: res};
            return result;
        }));
    }
    ngOnDestroy(): void {
        this._langChangeSub.unsubscribe();
    }
}
