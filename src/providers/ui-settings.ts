import { Injectable } from '@angular/core';

@Injectable()
export class UiSettings {
    defaultQsg: boolean = true;

    constructor(
    ) {
        this.defaultQsg = true;
    }

}
