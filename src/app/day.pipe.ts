import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Pondělí'
      case 2:
        return 'Úterý' 
      case 3:
        return 'Středa'
      case 4:
        return 'Čtvrtek'
      case 5:
        return 'Pátek'
      case 6:
        return 'Sobota'
      case 7:
        return 'Neděle'
    }
  }

}
