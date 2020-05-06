import {LocatorLiteral, LocatorSettings} from '../../models/remote-config.model';
import {TranslateMap} from './translate-map';
import {TranslateService} from '@ngx-translate/core';

export default class LiteralsAggregator {

  static filterPrefix = 'FILTER';

  static inject(literals: LocatorLiteral[]): {into: (translateService: TranslateService) => void}  {
    const lambda = {
      into : (translateService) => {
        LiteralsAggregator.engage(literals, translateService);
      }
    };
    return lambda;
  }

  private static engage(literals: LocatorLiteral[], service: TranslateService) {

    const map = TranslateMap;

    literals.forEach(literal => {
      if (map.hasOwnProperty(literal.code)) {
        service.translations[service.currentLang] = LiteralsAggregator.assignToObject(
          service.translations[service.currentLang],
          map[literal.code],
          literal.content
        );
      }

      const prefix = LiteralsAggregator.filterPrefix;
      if (literal.code.substr(0, prefix.length) === prefix) {
        if (!service.translations[service.currentLang]._custom) {
          service.translations[service.currentLang]._custom = [];
        }

        service.translations[service.currentLang]._custom[literal.code] = literal.content;
      }

    });
  }

  private static assignToObject(object: {}, path: string, value: string): {} {
    const pathMembers = path.split('.');

    const newObject = { ...object };
    let pointer = newObject;

    pathMembers.forEach(pathMember => {
      if (pointer.hasOwnProperty(pathMember)) {
        if (typeof pointer[pathMember] === 'string') {
          pointer[pathMember] = value;
        } else {
          pointer = pointer[pathMember];
        }
      }
    });

    return newObject;
  }
}
