import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { IHelpContext } from '../../../service/Utility/HelpContext/IHelpContext';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../../store';
import { SHOW_HELP_CONTEXT_DISPLAY, SET_HELP_ITEM, SHOW_HELP_ITEM } from '../../../actions';
import { Router } from '@angular/router';
import { HelpService } from '../help.service';
import { IHelp } from '../../../service/Data/User/Model/IHelp';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-helpContextDisplay',
  templateUrl: './helpContextDisplay.component.html',
  styleUrls: ['./helpContextDisplay.component.css'],
})


export class HelpContextDisplayComponent implements OnInit, OnDestroy {

    @Input()
    helpContextObject: IHelpContext;
    helpObject: IHelp;

    private num: number =0;
    private imageURL: Array<string> = new Array();
    private displayImageURL: string;

    private showSpacer: boolean;
    private navigateArrow: boolean = false;
    private leftArrow: boolean = false;
    private rightArrow: boolean = false;

    @select('showHelpItem')
    observableShowHelpItem: Observable<IHelp>
    showHelpItem: boolean = false;
    helpDisplayItem: IHelp;

    helpItemSubscription: Subscription;
      
    constructor(
        private ngRedux: NgRedux<IAppState>,
        public router: Router,
        private helpService: HelpService
    ) { }


    ngOnInit() {
        try { //Find the correct help object
            this.helpObject = this.helpService.helpByPageID(this.helpContextObject.helpObjectID);
        } catch (err) { }

        try { //Load the correct image(s)
            for (this.num = 0; this.num < this.helpContextObject.imageUrl.length; ++this.num){
                this.imageURL.push(this.helpContextObject.imageUrl[this.num]);
            }

            this.num = 0;
            this.displayImageURL = this.imageURL[this.num];
        }
        catch (err) {console.log(err) }

        try { //If more than one image show the navigation arrows
            if (this.helpContextObject.imageUrl[1] != null) {
                this.navigateArrow = true;
                this.leftArrow = false;
                this.rightArrow = true;
            }
        }
        catch (err) { }

        try { //If helpIObject has no article, "Full Article" chevron will not show, and needs a spacer div
            if (this.helpContextObject.helpObjectID == null) {
                this.showSpacer = true; //This will set the spacer for the footer
            }
        }
        catch (err) { }

        this.helpItemSubscription = this.observableShowHelpItem.subscribe(() => {
            this.helpDisplayItem = this.ngRedux.getState().showHelpItem;
            if (this.helpDisplayItem == null || this.helpDisplayItem == undefined) {
                this.showHelpItem = false;
            } else {
                this.showHelpItem = true;
            }
        });
    }

    openHelpObject() {
        this.ngRedux.dispatch({ type: SET_HELP_ITEM, helpItem: this.helpObject });
        this.helpService.incrementClick(this.helpObject).subscribe(x => console.log(x));
        this.ngRedux.dispatch({ type: SHOW_HELP_ITEM, showHelpItem: this.helpObject });
        
    }


    closeHelp() {
        this.ngRedux.dispatch({ type: SHOW_HELP_CONTEXT_DISPLAY, showHelpDisplay: this.helpContextObject = null });
    }

    /**
     * This will navigate to the image to the left in the array.
     * If there is no image to display, the left arrow will not show
     */
    navLeft() {
        try {
            var newIndex: number = (this.num - 1);
            this.displayImageURL = this.imageURL[newIndex];

            if (this.displayImageURL == null || this.displayImageURL == undefined)
            {
                this.leftArrow = false;
                this.displayImageURL = this.imageURL[0];
            } else {
                this.rightArrow = true;
                if (newIndex <= 0)
                {
                    this.leftArrow = false;
                }
                this.num = newIndex;      
            }
        } catch (err) {
            this.displayImageURL = this.imageURL[this.num];
        }
    }

    /**
     * This will navigate to the image to the right in the array.
     * If there is no image to display, the right arrow will not show
     */
    navRight() {
        try {
            var newIndex: number = (this.num + 1);
            this.displayImageURL = this.imageURL[newIndex];

            if (this.displayImageURL == null || this.displayImageURL == undefined)
            {
                this.rightArrow = false;
                this.displayImageURL = this.imageURL[this.num];

            } else{
                this.leftArrow = true;
                if (newIndex == (this.imageURL.length-1))
                {
                    this.rightArrow = false;
                }
                this.num = newIndex;
            }
        } catch (err) {
            this.displayImageURL = this.imageURL[this.num];
        }
    }

    ngOnDestroy() {
        this.helpItemSubscription.unsubscribe();
    }
}
