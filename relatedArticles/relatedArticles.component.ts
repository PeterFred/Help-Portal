import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IHelp } from '../../../service/Data/User/Model/IHelp';
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../../store';
import { Router } from '@angular/router';
//import { IHelpList } from '../../../models/ListObjects/IHelpList';
import { SET_HELP_ITEM, SHOW_HELP_CONTEXT_DISPLAY, SHOW_HELP_ITEM } from '../../../actions';
import { HelpService } from '../help.service';
import { Observable } from 'rxjs/Observable';
import { IHelpList } from '../../../models/ListObjects/IHelpList';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-relatedArticles',
  templateUrl: './relatedArticles.component.html',
  styleUrls: ['./relatedArticles.component.css']
})
export class RelatedArticlesComponent implements OnInit, OnDestroy {
    @Input()
    findRelatedHelp: IHelp;

    public helpList: IHelp[];
    public relatedArticles: Array<IHelp> = new Array();

    @select('helpList')
    observableHelpList: Observable<IHelpList>;

    @select('showHelpItem')
    observableShowHelpItem: Observable<IHelp>
    showHelpItem: boolean = false;
    helpDisplayItem: IHelp;

    helpListSubscription: Subscription;
    helpItemSubscription: Subscription;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        public router: Router,
        private _helpService: HelpService
    ) { }

    ngOnInit() {
        this.subscribeToStore();

        try {
            if (this.findRelatedHelp! != null) {
                this.loadRelatedArticles();
            }
        } catch (err) { }
    }


    /**
     * Description:
     * This will find all related HelpObjects with the same metaTags
     * for the current findRelatedHelp object. It will load unique instances into
     * an array relatedArticles : IHelp[]
     */
    loadRelatedArticles() {
        var results: Array<IHelp> = this.ngRedux.getState().helpList.helpObjects; //Get the current helpObjects from the store

        //loop1: Set up to search against each findRelatedHelp object metaTag
        for (var x: number = 0; x < this.findRelatedHelp.metaTags.length; x++) { 

            //loop2: Set up to search against each helpObject in the store
            for (var y: number = 0; y < results.length; y++) {

                loop3: //Set up to search through each helpObjects metaTags
                for (var z: number = 0; (z < this.findRelatedHelp.metaTags.length && results[y].metaTags.length); z++){

                    //If a match is found between findRelatedHelp and results MetaTags
                    if (this.findRelatedHelp.metaTags[x] == results[y].metaTags[z]) {
                        //loop4: check it is not already in the relatedArticles array
                        for (var i: number = 0; i < this.relatedArticles.length; i++) {
                            if (this.relatedArticles[i] == results[y]) {
                                break loop3; //If it is go back to loop3
                            }
                        }
                        //If it isn't push into the relatedArticles array
                        if (results[y] != this.findRelatedHelp) {
                            this.relatedArticles.push(results[y]);
                        }
                    }
                }
            }
        }
    }

    
    openHelpObject(help: IHelp) {
        this.ngRedux.dispatch({ type: SHOW_HELP_CONTEXT_DISPLAY, showHelpDisplay: null });

        this.ngRedux.dispatch({ type: SET_HELP_ITEM, helpItem: help });
        this._helpService.incrementClick(help).subscribe(x => console.log(x));
        this.ngRedux.dispatch({ type: SHOW_HELP_ITEM, showHelpItem: help });

        //ORIGINAL
        //this.ngRedux.dispatch({ type: SET_HELP_ITEM, helpItem: help });
        //this._helpService.incrementClick(help).subscribe(x => console.log(x));
        //this.subscribeToHelpRefresh;
        //this.router.navigateByUrl('/helpItem');
        
        this.loadRelatedArticles();
       
    }

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

    ngOnDestroy() {
        this.helpItemSubscription.unsubscribe();
        this.helpListSubscription.unsubscribe();
    }
}
