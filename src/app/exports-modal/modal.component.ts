import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent{
  @Input() showModal:boolean = true;
  @Input() tour:any;
  format:string = '';

  constructor() {}

  selectFormat(format) {
    this.format = format;
  }

  export() {
    console.log('export file', this.format, this.tour);
    this.reset();
  }

  reset() {
    this.format = '';
    this.showModal = false
  }
}
