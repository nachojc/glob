export class WindowRef extends Window {

  constructor() {
    super();
  }
  google: typeof google;

}


export class NoopWindowRef {

  constructor() {

  }

  screen = {
    orientation: {
      angle: 0,
      type: 'portrait-primary',
    },
  };

  navigator = {
    userAgent : 'mobile',
    onLine: true,
    connection: {
      effectiveType: '4g'
    }
  };
}

