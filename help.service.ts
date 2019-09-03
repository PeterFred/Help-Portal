import { IHelp } from '../../service/Data/User/Model/Ihelp';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { NgRedux, select } from 'ng2-redux';
import { IAppState } from '../../store';



@Injectable()
export class HelpService {
    public _requestURL: string;
       
    constructor(private _http: Http,
        private ngRedux: NgRedux<IAppState>,
    ) { }

    /**
     * Description:
     * Return a full list of all Help Items
     */
    allHelp(): Observable<IHelp[]> { 

        this._requestURL = 'api/help/allHelp';

        return this._http.get(this._requestURL)
            .map((response: Response) => <IHelp[]>response.json())
            //.do(data => console.log(data))
            .catch(this.handleError);      
    }

    /**
     * Description:
     * This will increment the help object click count in the DB. 
     * Keeps track of most popular articles.
     * @param Help_object 
     */
    incrementClick(help: IHelp): Observable<IHelp[]> { //this will increment the DB HelpObject 

        this._requestURL = 'api/help/incrementClick/' + help.ID;

        let jsontask = JSON.stringify(help);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.put(this._requestURL, jsontask, options)
            .map((response: Response) => <IHelp[]>response.json())
            //.do (data => console.log(data))
            .catch(this.handleError);
    }   

    /**
     * Description:
     * This will return the matching Observable help item seacrhed by page title
     * @param helpPage 
     */
    helpByPageTitle(helpPage: string): Observable<IHelp[]>{
        this._requestURL = 'api/help/helpByPageTitle/' + helpPage;

        return this._http.get(this._requestURL)
            .map((response: Response) => <IHelp[]>response.json())
    }

    /**
     * Description:
     * This will return the matching help item seacrhed by ID
     * @param helpID (NOTE - string NOT ObjectID)
     */
    helpByPageID(helpID: string): IHelp {
        var returnValue: IHelp;
        var results: Array<IHelp> = this.ngRedux.getState().helpList.helpObjects;

        for(var i: number = 0; i < results.length; i++)
        {
            var _help: IHelp = results[i];
            if (_help.ID == helpID){
                returnValue = _help;
                return returnValue;
            }
        }
      
      return null; //Help object not found
    }

    private handleError(error: Response) {
        console.error(error);
        let message = `Error status code ${error.status} at ${error.url}`;
        return Observable.throw(message);
    }
    
}

