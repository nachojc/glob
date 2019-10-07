import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';


export abstract class LanguageLoader {
    abstract getUrl(lang: string): string;
    abstract getTranslations(lang: string): Observable<any>;
}

/**
 * This loader is just a placeholder that does nothing,
 * in case you don't need a loader at all
 */
@Injectable()
export class LanguageFakeLoader extends LanguageLoader {
    getUrl(lang: string): string { return ''; }
    getTranslations(lang: string): Observable<any> {
        return of({});
    }
}


export class DefLanguageHttpLoader implements LanguageLoader {
    public module: string;
    constructor(
        public http: HttpClient,
        public prefix: string = '/assets/i18n/',
        public suffix: string = '.json',
        private _module: string = '') {
            this.module = _module + ((_module.length && _module[_module.length - 1] !== '/') ? '/' : '');
        }

    public getUrl(lang: string): string {
        return `${this.prefix}${this.module}${lang}${this.suffix}`;
    }
    public getTranslations(lang: string): Observable<any> {
        console.log(`${this.prefix}${this.module}${lang}${this.suffix}`);

        return this.http.get(`${this.prefix}${this.module}${lang}${this.suffix}`);
    }
}
