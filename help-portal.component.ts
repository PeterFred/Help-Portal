import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHelp } from '../../service/Data/User/Model/Ihelp';
import { Observable } from 'rxjs/Observable';
import { HelpService } from '../help-portal/help.service';
import { NgRedux, select} from "ng2-redux/lib";
import { IAppState } from "../../store";
import { CacheRefreshService } from "../../service/CacheRefresh/cache-refresh.service";
import { SET_HELP_LIST, SET_HELP_ITEM, SHOW_HELP_ITEM } from "../../actions";
import { IHelpList } from "../../models/ListObjects/IHelpList";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-help-portal',
    templateUrl: './help-portal.component.html',
    styleUrls: ['./help-portal.component.css'],
    providers: [HelpService]

})

export class HelpPortalComponent implements OnInit, OnDestroy {

    public helpList: IHelp[];
    public show = false; //Use to display RH content - SVG icons when rendered
    public subsrciption: Subscription;

    @select('helpList')
    observableHelpList: Observable<IHelpList>;

    @select('showHelpItem')
    observableShowHelpItem: Observable<IHelp>
    showHelpItem: boolean = false;
    helpDisplayItem: IHelp;

    helpListSubscription: Subscription;
    helpItemSubscription: Subscription;

    constructor(
        private _helpService: HelpService,             //Used to implement incrementClick method
        private ngRedux: NgRedux<IAppState>,          //Injects the store
        private _cacheRefresh: CacheRefreshService,   //Implements cache refreshing
        public router: Router
    ) {
    }

    ngOnInit() {
        this.subscribeToStore();
    }


    /**
     * Assign helplist on the completion of redux store initialisation
     */
    subscribeToStore() {
        this.helpListSubscription = this.observableHelpList.subscribe(() => {
            try {
                
                var store = this.ngRedux.getState();
                this.helpList = store.helpList.helpObjects;
            } catch (error) {
            };
        });

        this.helpItemSubscription = this.observableShowHelpItem.subscribe(() => {
            this.helpDisplayItem = this.ngRedux.getState().showHelpItem;
            if (this.helpDisplayItem == null || this.helpDisplayItem == undefined) {
                this.showHelpItem = false;
            } else {
                this.showHelpItem = true;
            }
        });
    }

    sortByClicks(): IHelp[] {
        var array = this.helpList ? this.helpList : [];
        var sorted = array.sort(function (a, b) { return (a.clicks < b.clicks) ? 1 : ((b.clicks < a.clicks) ? -1 : 0); });
        return sorted;
    }

    sortByDate(): IHelp[] {
        var array = this.helpList ? this.helpList : [];
        var sorted = array.sort(function (a, b) { return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0) });
        return sorted;
    }

    openHelpItem(help: IHelp) {
        this.ngRedux.dispatch({ type: SET_HELP_ITEM, helpItem: help });
        this._helpService.incrementClick(help).subscribe(x => console.log(x));
        this.ngRedux.dispatch({ type: SHOW_HELP_ITEM, showHelpItem: help });
                
    }
    


    ngOnDestroy() {
        this.helpItemSubscription.unsubscribe();
        this.helpListSubscription.unsubscribe();
    }
}