import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export function HttpLoaderFactory(http: HttpClient, moduleName = '') {
    return new TranslateHttpLoader(http, './assets/i18n/' + moduleName, '.json');
}

const text = {en: 'en', es: 'es'};
export class TranslateLoaderHelper implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(text[lang]);
    }
}
