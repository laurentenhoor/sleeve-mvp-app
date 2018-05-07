
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sleeves, SleeveStates } from '../../providers/sleeves';

@Component({
    selector: 'qsg',
    templateUrl: 'qsg.html'
})
export class Qsg {
    qsgStep = 0;
    qsgItems = [{
        category: 'Preparation',
        items: [{
            index: 0,
            image: 'assets/imgs/qsg/small/QSG_Screen 2.0_Remove-Cap.gif',
            title: 'Remove the cap',
            description: 'It can disturb the accuracy',
            automatic: false
        }, {
            index: 1,
            image: 'assets/imgs/qsg/small/QSG_Screen-3.0_Insert-Bottle.gif',
            title: 'Insert the bottle',
            description: 'Keep it attached while feeding',
            automatic: false
        }]
    }, {
        category: 'Volume check-in',
        items: [{
            index: 2,
            image: 'assets/imgs/qsg/small/QSG_Screen 4.1_4.2_Press button.gif',
            title: 'Press the button',
            description: 'While standing on a surface',
            automatic: true
        }]
    }
        , {
        category: 'Feeding',
        items: [{
            index: 3,
            image: 'assets/imgs/shark-milk.gif',
            title: 'Feed your little one',
            description: 'At least five seconds',
            automatic: true
        }]
    }, {
        category: 'Volume check-out',
        items: [{
            index: 4,
            image: 'assets/imgs/qsg/small/QSG_Screen 4.1_4.2_Press button.gif',
            title: 'Press the button',
            description: 'While standing on a surface',
            automatic: true
        }]

    }
    ]

    constructor(
        private nav: NavController,
        private sleevesService: Sleeves,
        private zone: NgZone
    ) {
        
    }

    ionViewDidLoad() {
        this.sleevesService.scanAndConnect().subscribe(() => {
            this.sleevesService.state().subscribe(state => {
                switch (state) {
                    case SleeveStates.DEVICE_FEEDING_EXPECTED:
                        this.initStartWeighing();
                        break;
                    case SleeveStates.DEVICE_WEIGHING_COMPLETED:
                        if (this.qsgStep == 2) {
                            this.completeStartWeighing();
                        }
                        break;
                    case SleeveStates.DEVICE_FEEDING:
                        this.zone.run(() => {
                            console.log('init Feeding State')
                            this.qsgStep = 4;
                        })
                        break;
                    case SleeveStates.DEVICE_BUTTON_PRESS:
                        if (this.qsgStep == 4) {
                            this.initEndWeighing();
                        }
                        break;
                    case SleeveStates.DEVICE_FEEDING_END:
                        this.closeFeed();
                        break;
                }
            }, error => {
                console.error('no states available', error)
            })
            this.sleevesService.feedData().then(feedData => {
                console.log('feeddata from QSG')
            }, error => {
                console.error(error)
            })
        })
    }

    initStartWeighing() {
        this.zone.run(() => {
            console.log('init start weighing');
            this.qsgStep = 2;
            let item = this.qsgItems[1].items[0];
            item.title = "Busy measuring...";
            item.description = "Make sure it's on a surface";
        })
    }

    completeStartWeighing() {
        this.zone.run(() => {
            console.log('completeStartWeighing')
            this.qsgStep = 3;
            let item = this.qsgItems[1].items[0];
            item.title = "Measure volume";
            item.description = "Good job!"
        })
    }

    initEndWeighing() {
        this.zone.run(() => {
            console.log('init end weighing');
            let item = this.qsgItems[3].items[0];
            item.title = "Busy measuring...";
            item.description = "Make sure it's on a surface";
        })
    }

    closeFeed() {
        this.zone.run(() => {
            console.log('init Feeding State')
            this.qsgStep = 5;
            let item = this.qsgItems[3].items[0];
            item.title = "Measure volume";
            item.description = "Awesome!";
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