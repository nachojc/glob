import { LanguageService } from './languages.service';
import { Observable, BehaviorSubject } from 'rxjs';

export class LanguageStore {
    private _instance: LanguageStore;
    private _currentLang = 'en';
    private _defLang = 'en';
    private _changeLang$: BehaviorSubject<string> = new BehaviorSubject<string>(this._currentLang);

    constructor() {
        if (!this._instance) {
            this._instance = this;
        }
        return this._instance;
    }
    onLanguageChange(): Observable<string> {
        return this._changeLang$;
    }

    setDefaultLang(lang: string) {
        this._defLang = lang;
    }
    use(lang: string) {
        this._currentLang = lang;
        this._changeLang$.next(this._currentLang);
    }
}
