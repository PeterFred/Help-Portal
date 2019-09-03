import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from "ng2-redux/lib"; 
import { Subscription } from 'rxjs';
import { IHelp } from '../../../service/Data/User/Model/IHelp';
import { IAppState } from '../../../store';
import { IHelpContent } from '../../../service/Data/User/Model/IHelpContent';
import { NewLinePipe } from '../newLine.pipe'; 
import { SHOW_HELP_IMAGE, SHOW_HELP_ITEM } from "../../../actions";

@Component({
  selector: 'helpItemDisplay',
  templateUrl: './helpItemDisplay.component.html',
  styleUrls: ['./helpItemDisplay.component.css']
})
export class HelpItemDisplayComponent implements OnInit, OnDestroy {

  content: Array<IHelpContent>;

  @Input()
  helpDisplayObject: IHelp;

  @select('helpItem') // Sets the help object to display
  observableHelpItem: Observable<IHelp>;

  @select('showHelpImage') // Displays the expanded image
  observableShowHelpImage: Observable<IHelpContent>;
  showHelpImage: boolean = false;
  helpContentObject: IHelpContent;

  @select('showHelpItem') // Displays HelpItem page itself
  observableShowHelpItem: Observable<IHelp>
  showHelpItem: boolean = false;
  helpDisplayItem: IHelp;

  helpItemsubscription: Subscription;
  showHelpImageSubscription: Subscription;
  helpObject: IHelp;
  helpItemSubscription: Subscription;

  constructor(
      private ngRedux: NgRedux<IAppState>,
  ) {  }

  ngOnInit() {
      this.subscribeToStore();
  }

  subscribeToStore() {
      this.helpItemSubscription = this.observableHelpItem.subscribe(() => {
          try {
              this.helpObject = this.ngRedux.getState().helpItem;
              this.content = this.helpObject.content;
          } catch (err) { }
      });

      this.showHelpImageSubscription = this.observableShowHelpImage.subscribe(() => {
          this.helpContentObject = this.ngRedux.getState().showHelpImage;
          if (this.helpContentObject == null || this.helpContentObject == undefined) {
              this.showHelpImage = false;
          } else {
              this.showHelpImage = true;
          }
      });
  }

  closeHelp() {
      this.ngRedux.dispatch({ type: SHOW_HELP_ITEM, showHelpItem: null });
  }

  expandImage(image) {
      try {
         this.helpContentObject = image;
      } catch (err) { }
      this.ngRedux.dispatch({ type: SHOW_HELP_IMAGE , showHelpImage: this.helpContentObject});
  }

  closeExpandedImage() {
      this.ngRedux.dispatch({ type: SHOW_HELP_IMAGE, showHelpImage: this.helpContentObject = null });
  }

  ngOnDestroy() { 
      this.helpItemSubscription.unsubscribe();
      this.showHelpImageSubscription.unsubscribe();
  }
    
}
