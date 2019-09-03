import { Component, OnInit, Input } from '@angular/core';
import { IHelpContent } from "../../../service/Data/User/Model/IHelpContent";
import { NgRedux, select } from "ng2-redux";
import { IAppState } from '../../../store';
import { SHOW_HELP_IMAGE } from "../../../actions";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-helpImage',
  templateUrl: './helpImage.component.html',
  styleUrls: ['./helpImage.component.css']
})
export class HelpImageComponent implements OnInit {
  @Input()
  displayObject: IHelpContent;

  private displayImageURL: string;
  
  constructor(
      private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
      try {
          this.displayImageURL = this.displayObject.imageUrl;
      } catch (err) { }
  }

  closeHelp() {
      this.ngRedux.dispatch({ type: SHOW_HELP_IMAGE, showHelpImage: this.displayObject =null });
  }
}
