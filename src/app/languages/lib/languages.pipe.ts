import { PipeTransform, Injectable, Pipe, OnDestroy } from '@angular/core';

@Injectable()
@Pipe({
  name: 'language',
  pure: false
})
export class LanguagePipe implements PipeTransform, OnDestroy {
    transform(value: any, ...args: any[]) {

    }
    ngOnDestroy(): void {

    }

}
