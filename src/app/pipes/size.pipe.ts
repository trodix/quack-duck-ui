import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(contentSize: string | undefined): string {
    let contentSizeUnit =  "";
    let contentSizeNumber = 0;

    if (!contentSize) {
      return "";
    }

    contentSizeNumber = Number.parseInt(contentSize, 10);

    if (Math.abs(contentSizeNumber) < 1024) {
      contentSizeUnit = "B";
    } else if (Math.abs(contentSizeNumber) < 1024 ** 2) {
      contentSizeNumber = SizePipe.round1Decimal(contentSizeNumber / 1024);
      contentSizeUnit = "KB";
    } else if (Math.abs(contentSizeNumber) < 1024 ** 3) {
      contentSizeNumber = SizePipe.round1Decimal(contentSizeNumber / 1024 / 1024);
      contentSizeUnit = "MB";
    } else if (Math.abs(contentSizeNumber) < 1024 ** 4) {
      contentSizeNumber = SizePipe.round1Decimal(contentSizeNumber / 1024 / 1024 / 1024);
      contentSizeUnit = "GB";
    } else if (Math.abs(contentSizeNumber) < 1024 ** 5) {
      contentSizeNumber = SizePipe.round1Decimal(contentSizeNumber / 1024 / 1024 / 1024 / 1024);
      contentSizeUnit = "TB";
    }

    return contentSizeNumber + " " + contentSizeUnit;
  }

  private static round1Decimal(a: number): number {
    return Math.round(a * 10) / 10;
  }

}
