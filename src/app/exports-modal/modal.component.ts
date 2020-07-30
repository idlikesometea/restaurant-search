import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent{
  @Input() showModal:boolean = true;
  @Output() onDone = new EventEmitter<any>();
  format:string = '';
  save:boolean = false;
  constructor() {}

  selectFormat(format) {
    this.format = format;
  }

  getIconClass() {
    let cssClass = 'icon heart';
    return this.save ? cssClass + '-fill' : cssClass;
  }

  dismiss(cancel) {
    if (cancel) {
      this.onDone.emit({save:false,format:''});
    } else {
      this.onDone.emit({save:this.save,format:this.format});
    }
  }
}
