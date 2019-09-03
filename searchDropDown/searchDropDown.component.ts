import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IHelp } from '../../../service/Data/User/Model/Ihelp';
import { NgRedux, select } from "ng2-redux/lib";
//import { Router, ActivatedRoute } from '@angular/router';
import { IAppState } from '../../../store';
import { SET_HELP_ITEM, SHOW_HELP_ITEM } from '../../../actions';
import { Observable } from 'rxjs/Observable';
import { IHelpList } from '../../../models/ListObjects/IHelpList';
import { CacheRefreshService } from '../../../service/CacheRefresh/cache-refresh.service';
import { HelpService } from '../help.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'searchDropDown',
  templateUrl: './searchDropDown.component.html',
  styleUrls: ['./searchDropDown.component.css'],
  providers: [HelpService]
})

export class SearchDropDownComponent implements OnInit, OnDestroy {

    @Input() helpObjects: IHelp[];
    @Input() filter: string;

    public helpList: IHelp[];
    public subsrciption: Subscription;  //Used for increment clicks method

    @select('showHelpItem')
    observableShowHelpItem: Observable<IHelp>
    showHelpItem: boolean = false;
    helpDisplayItem: IHelp;

    helpItemSubscription: Subscription;

    constructor(
        private _helpService: HelpService, //Used for increment clicks method
        private ngRedux: NgRedux<IAppState>,     
    ) {}

    ngOnInit() {
        this.subscribeToStore();
    }

    subscribeToStore() {

        this.helpItemSubscription = this.observableShowHelpItem.subscribe(() => {
            this.helpDisplayItem = this.ngRedux.getState().showHelpItem;
            if (this.helpDisplayItem == null || this.helpDisplayItem == undefined) {
                this.showHelpItem = false;
            } else {
                this.showHelpItem = true;
            }
        });
    }

    openHelpObject(help: IHelp) {
        this.ngRedux.dispatch({ type: SET_HELP_ITEM, helpItem: help });
        this._helpService.incrementClick(help).subscribe(x => console.log(x));
        this.ngRedux.dispatch({ type: SHOW_HELP_ITEM, showHelpItem: help });
    }

    ngOnDestroy() {
        this.helpItemSubscription.unsubscribe();
    }

}
