import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';;
import { ResourcesPluginConfiguration } from './configuration-builder';

import { DatetimeValueConverter } from './converters/datetime';
import { DurationValueConverter } from './converters/datetime-duration';
import { FilterValueConverter } from './converters/filter';
import { JoinValueConverter } from './converters/join';
import { NumberFormatValueConverter } from './converters/numberformat';
import { NumeralValueConverter } from './converters/numeral';
import { RouteHrefValueConverter } from './converters/route-href';
import { SortValueConverter } from './converters/sort';
import { SumValueConverter } from './converters/sum';
import { TakeValueConverter } from './converters/take';

export function configure(fc: FrameworkConfiguration, cfg?: (pc: ResourcesPluginConfiguration) => void): void {
  fc.globalResources([
    // binding behaviors
    PLATFORM.moduleName('./binding-behaviors/integer-input'),

    // value converters
    PLATFORM.moduleName('./converters/filter'),
    PLATFORM.moduleName('./converters/join'),
    PLATFORM.moduleName('./converters/datetime-duration'),
    PLATFORM.moduleName('./converters/datetime'),
    PLATFORM.moduleName('./converters/numberformat'),
    PLATFORM.moduleName('./converters/numeral'),
    PLATFORM.moduleName('./converters/take'),
    PLATFORM.moduleName('./converters/sort'),
    PLATFORM.moduleName('./converters/sum'),

    // view hooks
    PLATFORM.moduleName('./view-hooks/as-element')
  ]);

  const pc = fc.container.get(ResourcesPluginConfiguration);
  if (cfg) {
    cfg(pc);
  }
}

export {
  ResourcesPluginConfiguration,

  DatetimeValueConverter,
  DurationValueConverter,
  FilterValueConverter,
  JoinValueConverter,
  NumberFormatValueConverter,
  NumeralValueConverter,
  RouteHrefValueConverter,
  SortValueConverter,
  SumValueConverter,
  TakeValueConverter,
};

export * from './utils/geolocator';
export * from './utils/media-device';
export * from './utils/notificator';
export * from './utils/speech-generator';
export * from './utils/timeout-intervaller';

export * from './interfaces';