
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves } from '../../providers/sleeves';


@Component({
    selector: 'qsg',
    templateUrl: 'qsg.html'
})
export class Qsg {
    qsgStep = 0;
    qsgItems = [{
        index: 0,
        image: 'assets/imgs/qsg/small/QSG_Screen 2.0_Remove-Cap.gif',
        title: 'Remove the Cap',
        description: 'It can disturb the accuracy'
    }, {
        index:1,
        image: 'assets/imgs/qsg/small/QSG_Screen-3.0_Insert-Bottle.gif',
        title: 'Insert the Bottle',
        description: 'Keep it attached during the feed'
    }]

    constructor(
        private nav: NavController,
        private sleevesService: Sleeves,
    ) {


    }

    ionViewDidEnter() {
        this.sleevesService.state().subscribe(state => {
            console.log('Received state from sleeve:', state)
        }, error => {
            console.error('no states available', error)
        })
        this.sleevesService.feedData().then(feedData => {
            console.log('feeddata from QSG')
        }, error => {
            console.error(error)
        })
    }

    closeModal() {
        this.sleevesService.disconnectAll();
        this.nav.pop();
    }

    finishInstallation() {
        this.nav.pop();
    }

}