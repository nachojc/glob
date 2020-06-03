import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const MenuAnimations = {
  menuTrigger: trigger('menuTrigger', [
    state(
      'menuOpened',
      style({
        transform: 'translateX(0)'
      })
    ),
    state(
      'menuClosed',
      style({
        transform: 'translateX(-380px)'
      })
    ),
    transition('menuOpened=>menuClosed', animate('250ms')),
    transition('menuClosed=>menuOpened', animate('250ms'))
  ])
};
