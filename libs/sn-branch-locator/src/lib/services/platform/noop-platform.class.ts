import { Observable, of } from 'rxjs';

export const NoopPlatform = {
    orientation: {} as ScreenOrientation,
    isMobile: true,
    isDesktop: true,
    orientationChange: of({} as ScreenOrientation),
    screen: Screen
};
