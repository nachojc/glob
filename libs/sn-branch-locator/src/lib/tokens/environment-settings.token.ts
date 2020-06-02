import { InjectionToken } from '@angular/core';
import {EnvironmentSettingsModel} from '../models/environment-settings.model';

export let ENV_SETTINGS = new InjectionToken<EnvironmentSettingsModel>('Environment settings');
