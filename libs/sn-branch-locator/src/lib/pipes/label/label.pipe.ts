import { Pipe, PipeTransform } from '@angular/core';
import {ConfigurationService} from '../../services/configuration/configuration.service';
import {LocatorLiteral} from '../../models/remote-config.model';

@Pipe({
  name: 'label'
})
export class LabelPipe implements PipeTransform {

  labels: LocatorLiteral[];

  constructor(private configuration: ConfigurationService) {
    this.configuration.settings$.subscribe(settings => {
      this.labels = settings.literals;
    });
  }

  transform(code: string): any {
    if (!this.labels) {
      return null;
    }

    const label = this.labels.find(l =>  l.code === code );

    return label ? label.content : '(' + code + ')';
  }
}
