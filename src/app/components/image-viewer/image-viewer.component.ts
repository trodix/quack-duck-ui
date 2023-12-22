import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  @Input("src") src: string | SafeUrl | undefined;
  @Output() onClose = new EventEmitter<void>();
  @ViewChild("imgRef") imgRef!: ElementRef<HTMLInputElement>;
  rotationDeg: number = 0;

  constructor() { }

  ngOnInit(): void {

  }

  onClosePreview() {
    //this.src = undefined;
    this.onClose.emit();
  }

  rotateLeft() {
    console.log("rotate left")
    this.rotationDeg += 90;
  }

  rotateRight() {
    console.log("rotate right")
    this.rotationDeg -= 90;
  }

}
