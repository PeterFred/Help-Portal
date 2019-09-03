import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'NewLine' })
export class NewLinePipe implements PipeTransform {
    constructor() {
    }
    transform(text: string){
        //return text.replace(/\n/g, '<br/>'); 
        return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
}