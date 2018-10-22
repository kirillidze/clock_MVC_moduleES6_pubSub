'use strict';

import {
    PubSubService
} from './pubSubService.js';

export class Model {
    constructor(timezone) {
        this.timezone = timezone;
        this.changes = new PubSubService();
        // модель предоставляет поле date для чтения извне
        this.date = new Date();
        let timezoneHours = this.date.getUTCHours() + timezone;
        this.date.setHours(timezoneHours);
        // модель обновляет себя
        setInterval(() => {
            this.date = new Date();
            timezoneHours = this.date.getUTCHours() + timezone;
            this.date.setHours(timezoneHours);

            // и нотифицирует слушателя путем вызова
            // его функции обратного вызова
            this.changes.pub('change', this.date);

        }, 1000);
    }

}