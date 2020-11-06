import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month'
})
export class MonthPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 0:
        return 'Leden'
      case 1:
        return 'Únor' 
      case 2:
        return 'Březen'
      case 3:
        return 'Duben'
      case 4:
        return 'Květen'
      case 5:
        return 'Červen'
      case 6:
        return 'Červenec'
      case 7:
        return 'Srpen'
      case 8:
        return 'Září'
      case 9:
        return 'Říjen'
      case 10:
        return 'Listopad'
      case 11:
        return 'Prosinec'
    }
  }
}
