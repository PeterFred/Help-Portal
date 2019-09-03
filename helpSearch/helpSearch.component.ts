import { Component, OnInit, OnDestroy} from '@angular/core';
import { IHelp } from '../../../service/Data/User/Model/Ihelp';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from "ng2-redux/lib";
import { IAppState } from "../../../store";
import { IHelpList } from "../../../models/ListObjects/IHelpList";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-helpSearch',
    templateUrl: './helpSearch.component.html',
    styleUrls: ['./helpSearch.component.css'],
})

export class HelpSearchComponent implements OnInit, OnDestroy {

    public help: IHelp[];
    public filteredHelp: IHelp[];
    public sortedHelp: IHelp[];
    private _listFilter: string;
            
    @select('helpList')
    observableHelpList: Observable<IHelpList>;

    subsrciption: Subscription;
     
    constructor(
        private ngRedux: NgRedux<IAppState>, //Injects the store
    ) {
    }

    ngOnInit() {
        this.subsrciption = this.observableHelpList.subscribe(() => {
            try {
                var store = this.ngRedux.getState();
                this.help = store.helpList.helpObjects;
                this.filteredHelp = this.help;
            } catch (error) {
            };
        });
    }

    get listFilter(): string {
        return this._listFilter; //ngModel continualy calls method for asynchronous data entry
    }

    set listFilter(value: string) {
        this.filteredHelp = [];     //Clears the array
        this._listFilter = value;   //Sets _listfilter to the entered value ()
          
        if (this.listFilter) { //While listfilter contains a value -ie user inputy
            //Sets keyWordArray by calling splitStringIntoArray and passing in the current user input
            //This enables comparison of each letter entered with each letter in IHelp pageTitle
            let keywordArray: string[] = this.splitStringIntoArray(this.listFilter); 
            //Loop through the keyWordArray and compare each element 
            for (let keyword of keywordArray) {
                if (!keyword) continue;  // Skip any blank element
                //set filteredHelp to call perfromFiler - the main search algorithm
                this.filteredHelp = this.performFilter(keyword);
            }
        }
        this.sortedHelp = this.filteredHelp;    //Return the filetered help to the ngModel
        this.filteredHelp = [];  // Clear the filteredHelp array to renew for next user input
    }
    /**
  * Remove invalid user input and whitespace, and turn string into an array to enable filtering
  * @param value User input
  */
    splitStringIntoArray(value: string): string[] {
        let correctInput = /[^A-Za-z0-9]+/; //Only include alphabetical input
        let tempArray: string[] = value.trim().split(correctInput); //Remove whitespace and turn string into sting[]
        return Array.from(new Set(tempArray));  //An array without duplicates
    }

   /**
  * Set the input string to lowercase to ensure matching
  * Using a filter method, return the pageTitle elements (set to lowercase to ensure suitable match)
  * of the IHelp array that match the input string array from the user input.
  * @param inputStringArray User input that has been converted to string[]
  */
    performFilter(inputStringArray: string): IHelp[] {
        inputStringArray = inputStringArray.toLocaleLowerCase(); 
        return this.help.filter((helpItems: IHelp) =>helpItems.pageTitle.toLocaleLowerCase().indexOf(inputStringArray) !== -1);
    }

    ngOnDestroy() {
        this.subsrciption.unsubscribe();
    }
 }