
import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { SleeveService, SleeveStates } from '../../providers/sleeve/sleeve.service';
import { TabsPage } from '../tabs/tabs';
import { Pairing } from '../pairing/pairing';

@Component({
    selector: 'quick-start-list',
    templateUrl: 'quick-start-list.html'
})
export class QuickStartList {
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
            // image: 'assets/imgs/qsg/small/QSG_Screen-3.0_Insert-Bottle.gif',
            image: 'assets/imgs/qsg/small/Smartsleeve_teaser_2.gif',
            title: 'Insert the bottle',
            description: 'Keep it attached while feeding',
            automatic: false
        }]
    }, {
        category: 'Volume check-in',
        items: [{
            index: 2,
            image: 'assets/imgs/qsg/small/QSG_Screen-5.1_5.2_B-Weight-start-volume-on-table_cropped.gif',
            title: 'Press the button',
            description: 'While standing on a surface',
            automatic: true
        }]
    }, {
        category: 'Feeding',
        items: [{
            index: 3,
            image: 'assets/imgs/qsg/small/Smartsleeve_teaser_3.gif',
            title: 'Feed your little one',
            description: 'At least five seconds',
            automatic: true
        }]
    }, {
        category: 'Volume check-out',
        items: [{
            index: 4,
            image: 'assets/imgs/qsg/small/QSG-Screen-8.1-8.2_Finish-Feeding-on-table_SD-10fps-cropped.gif',
            title: 'Press the button',
            description: 'While standing on a surface',
            automatic: true
        }]
    }
    ]

    constructor(
        private nav: NavController,
        private sleeveService: SleeveService,
        private zone: NgZone,
        private events: Events
    ) {

    }

    showError(item) {
        item['alertMessage'] = "Retry on a flat hard surface"
    }

    ionViewDidLoad() {
        this.sleeveService.state().subscribe(state => {
            this.hideErrors();
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
                case SleeveStates.BUTTON_PRESSED:
                    if (this.qsgStep == 4) {
                        this.initEndWeighing();
                    }
                    break;
                case SleeveStates.DEVICE_WEIGHING_TIMEOUT:
                    if (this.qsgStep == 2) {
                        this.showStartWeighError();
                    } else {
                        this.showEndWeighError();
                    }
                    break;
                case SleeveStates.DEVICE_FEEDING_END:
                    this.closeFeed();
                    break;
                case SleeveStates.BLE_ADVERTISING:
                    this.nav.push(Pairing, {}, { animation: 'md-transition' });
                    break;
            }
        }, error => {
            console.error('no states available', error)
        })
        // this.sleeveService.feedData().then(feedData => {
        //     console.log('feeddata from QSG')
        // }, error => {
        //     console.error(error)
        // })
    }

    hideErrors() {
        this.qsgItems[1].items[0]['alertMessage'] = null;
        this.qsgItems[3].items[0]['alertMessage'] = null;
    }

    nextStep() {
        this.zone.run(() => {
            this.qsgStep = this.qsgStep + 1;
        })
        // if (this.qsgStep == 2) {
        //     this.startWeighingSimulation();
        // }
    }

    showStartWeighError() {
        this.zone.run(() => {
            let item = this.qsgItems[1].items[0];
            item['alertMessage'] = "Retry on a flat hard surface"
            item.image = 'assets/imgs/qsg/small/QSG_Screen-5.1_5.2_B-Weight-start-volume-on-table_cropped.gif';
            item.title = 'Press the button';
            item.description = 'While standing on a surface';
        })
    }

    showEndWeighError() {
        this.zone.run(() => {
            let item = this.qsgItems[3].items[0];
            item['alertMessage'] = "Retry on a flat hard surface";
            item.image = 'assets/imgs/qsg/small/QSG_Screen 4.1_4.2_Press button.gif';
            item.title = 'Press the button';
            item.description = 'While standing on a surface';
        })
    }

    startWeighingSimulation() {
        let self = this;
        let item = self.qsgItems[1].items[0];
        setTimeout(() => {
            self.initStartWeighing();
            setTimeout(() => {
                this.showError(item)
                self.zone.run(() => {
                    console.log('init start weighing');
                    self.qsgStep = 2;
                    item.title = "Press the button";
                    item.description = "While standing on a surface";
                    item.image = 'assets/imgs/qsg/small/QSG_Screen-5.1_5.2_B-Weight-start-volume-on-table_cropped.gif';
                })
                setTimeout(() => {
                    item['alertMessage'] = "";
                    self.initStartWeighing();
                    setTimeout(() => {
                        self.completeStartWeighing();

                        setTimeout(() => {

                            self.zone.run(() => {
                                console.log('init end weighing');
                                self.qsgStep = 4;

                            });
                        }, 6000)
                    }, 2000)
                }, 7000)
            }, 7000)
        }, 4000)
    }

    initStartWeighing() {
        this.zone.run(() => {
            console.log('init start weighing');
            this.qsgStep = 2;
            let item = this.qsgItems[1].items[0];
            item.title = "Busy measuring...";
            item.description = "Make sure it's on a surface";
            // item.image = "https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2017/08/1501862810blinking-eye-quake.gif";
            // item.image = 'https://cdn.dribbble.com/users/4613/screenshots/911982/jar-loading.gif';
            // item.image = 'https://cdn.dribbble.com/users/396000/screenshots/2144427/liquid-dribbble.gif';
            item.image = 'assets/imgs/qsg/small/QSG_Measuring.gif';
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
            item.image = 'assets/imgs/qsg/small/QSG_Measuring.gif';
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
        setTimeout(() => {
            this.finishInstallation();
        }, 1000)
    }

    closeModal() {
        // this.nav.pop({ animation: 'md-transition' });
        // this.nav.popToRoot({ animation: 'md-transition' }) 
        this.nav.setRoot(TabsPage, {}, { animate: true, direction: 'forward', animation: 'md-transition' });
    }

    finishInstallation() {

        this.closeModal();

        // this.nav.pop();
        // setTimeout(()=>{
        //     this.events.publish('synchronize-feeds');
        // },500) 

    }

}