import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';

export abstract class LanguageLoader {
    abstract getTranslations(lang: string): Observable<any>;
}

/**
 * This loader is just a placeholder that does nothing,
 * in case you don't need a loader at all
 */
@Injectable()
export class LanguageFakeLoader extends LanguageLoader {
    getTranslations(lang: string): Observable<any> {
        return of({});
    }
}

@Injectable()
export class DefLanguageHttpLoader implements LanguageLoader {
    constructor(
        private http: HttpClient,
        public prefix: string = '/assets/i18n/',
        public suffix: string = '.json',
        private module: string = '') {}

    /**
     * Gets the translations from the server
     */
    public getTranslations(lang: string): Observable<any> {
      return this.http.get(`${this.prefix}${this.module}/${lang}${this.suffix}`);
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new DefLanguageHttpLoader(http, '/public/lang-files/', '-lang.json', '');
}
