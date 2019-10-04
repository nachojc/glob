import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

export abstract class LanguageLoader {
    abstract getTranslate(lang: string): Observable<any>;
}

/**
 * This loader is just a placeholder that does nothing,
 * in case you don't need a loader at all
 */
@Injectable()
export class LanguageFakeLoader extends LanguageLoader {
    getTranslate(lang: string): Observable<any> {
        return of({});
    }
}
