import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

// tslint:disable: no-string-literal
const sanitizerMock: any = {
  bypassSecurityTrustHtml: () => { },
  bypassSecurityTrustStyle: () => { },
  bypassSecurityTrustScript: () => { },
  bypassSecurityTrustUrl: () => { },
  bypassSecurityTrustResourceUrl: () => { }
};
const pipe = new SafePipe(sanitizerMock as DomSanitizer);

describe('SafePipe', () => {
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should execute the respective bypass security function depending on the data type', () => {
    const value = '123';
    const types = ['html', 'style', 'script', 'url', 'resourceUrl'];
    const bypasses = [
      'bypassSecurityTrustHtml',
      'bypassSecurityTrustStyle',
      'bypassSecurityTrustScript',
      'bypassSecurityTrustUrl',
      'bypassSecurityTrustResourceUrl'
    ];
    const spies = bypasses.map((bypassName: any) => spyOn(pipe['sanitizer'], bypassName));

    for (let i = 0; i < types.length; i++) {
      pipe.transform(value, types[i]);
      expect(spies[i]).toHaveBeenCalledWith(value);
    }
  });

  it('should throw an error when an invalid type is passed to the pipe', () => {
    const value = '123';
    const type = 'not_valid_type';
    const errMsg = `Invalid safe type specified: ${type}`;
    expect(() => (pipe.transform(value, type))).toThrow(new Error(errMsg));
  });
});
