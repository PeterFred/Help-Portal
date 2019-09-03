import { Component, Input } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../../../store';
import { SHOW_HELP_CONTEXT_DISPLAY, SHOW_HELP_CONTEXT_ICONS, SHOW_HELP_MENU } from '../../../actions';
import { IHelpContext } from '../../../service/Utility/HelpContext/IHelpContext';
import { IHelp } from '../../../service/Data/User/Model/IHelp';

@Component({
    selector: 'app-helpContextIcon',
    templateUrl: './helpContextIcon.component.html',
    styleUrls: ['./helpContextIcon.component.css'],
})
export class HelpContextIconComponent {
    @Input()
    helpContextObject: IHelpContext;
    helpObject: IHelp;

    constructor(
        private ngRedux: NgRedux<IAppState>,) {
    }

    openhelpContextDisplay() {
        var showHelp = false;
        var showIcons = false;
      
        //close the helpMenu
        this.ngRedux.dispatch({ type: SHOW_HELP_MENU, showHelpMenu: showHelp });

        //close the icons
        this.ngRedux.dispatch({ type: SHOW_HELP_CONTEXT_ICONS, showHelpIcons: showIcons });

        //Open the HelpContextDisplay
        this.ngRedux.dispatch({ type: SHOW_HELP_CONTEXT_DISPLAY, showHelpDisplay: this.helpContextObject });
    }
}
