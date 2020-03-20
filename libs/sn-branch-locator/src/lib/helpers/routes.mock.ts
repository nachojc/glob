import { Routes } from '../models/routes.model';

export const routesMock: Array<Routes> = [
  {
    id: 1,
    instructions: 'Head <b>south</b><div style="font-size:0.9em">Restricted-usage road</div>',
    distance: '0.2 km',
    time: '1 min',
    maneuver: 'turn-left'
  },
  {
    id: 2,
    instructions: 'Turn <b>right</b><div style="font-size:0.9em">Partial restricted-usage road</div>',
    distance: '86 m',
    time: '1 min',
    maneuver: 'turn-right'
  }
];
