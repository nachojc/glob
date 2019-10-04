import { AfterViewChecked, OnDestroy, Directive } from '@angular/core';

@Directive({
    selector: '[language],[sn-language]'
})
export class LanguageDirective implements AfterViewChecked, OnDestroy {
    ngAfterViewChecked(): void {

    }

    ngOnDestroy(): void {

    }

}
