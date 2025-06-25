import { datetimeConfigure } from './converters/datetime-config';
import { DatetimeValueConverter } from './converters/datetime';
import { DurationValueConverter, durationConfigure } from './converters/datetime-duration';


export class ResourcesPluginConfiguration {
    duration(cfg: durationConfigure) {
        DurationValueConverter.configure(cfg);

        return this;
    }

    datetime(cfg: datetimeConfigure) {
        DatetimeValueConverter.configure(cfg);

        return this;
    }
}