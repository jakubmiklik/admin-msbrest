
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  date = new Date(Date.now());
  calendar = {
    day: this.date.getDay(),
    dayOfMonth: this.date.getDate(),
    month: this.date.getMonth()
  }

  get absenceText(){
    switch (this.getActualAbsence()) {
      case 0:
        return 'Žadné omluvené dítě'
      case 1:
        return 'Omluvené dítě'
      case 2:
      case 3:
      case 4:
        return 'Omluvené děti'
      default:
        return 'Omluvených dětí'
    }
  } 
  numberOfExcused: number = 0;
  users: User[] = [];

  constructor(private firestore: AngularFirestore) {

  }

  ngOnInit(): void {
    
    this.firestore.collection('users').ref.get().then((users) => {
      users.docs.forEach((user,index)=> {
        this.users[index] = {uid: user.get('uid'), children: []};
      })
    }).finally(()=>{
      this.users.forEach((user, index) => {
        this.firestore.collection(`users/${user.uid}/children`).ref.get().then((children)=>{
          children.docs.forEach((child, index2) => {
            this.users[index].children[index2] = {...child.data() as Child, absence: []};
          })
        }).finally(async () =>{
          this.users.forEach((user)=>{
            user.children.forEach((child) => {
              this.firestore.collection(`users/${user.uid}/children/${child.id}/absence`).ref.get().then((absence)=> {
                absence.docs.forEach((item, index3) => {
                  child.absence[index3] = item.data() as Absence;
                })
              })
            })
          })  
        })
      })
    });
  }

  getActualAbsence(){
    let number = 0;
    let array: ArrayToDisplay[] = [];
      this.users.forEach((user, indexUser) => {
        user.children.forEach((child, index) => {
          array.push({childName: child.name, absence: []});
          array[array.length - 1].absence = child.absence.filter((a)=> {
            return (new Date(new Date(a.dateTo).setHours(23,59, 59, 999)).getTime() >= (new Date(new Date(Date.now()).setHours(23, 59, 59, 999)).getTime()) && a.dateFrom <= Date.now())
          })

        })
      })
    for(let i = 0; i < array.length; ++i){
      if(array[i].absence.length > 0)
      ++number;
    }
    return number;
  }

}

export interface ArrayToDisplay{
  childName: string;
  absence: Absence[];
}
export interface Absence {
  dateFrom: number;
  dateTo: number;
  text: string;
}
export interface Child {
  id: string;
  name: string;
  absence?: Absence[];
}
export interface User {
  uid: string;
  children?: Child[];
}
