import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-omluvenky',
  templateUrl: './omluvenky.component.html',
  styleUrls: ['./omluvenky.component.scss']
})
export class OmluvenkyComponent implements OnInit {

  users: User[] = [];
  
  constructor(public firestore: AngularFirestore) {

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
    let array: ArrayToDisplay[] = [];
      this.users.forEach((user, indexUser) => {
        user.children.forEach((child, index) => {
          array.push({childName: child.name, absence: []});
          array[array.length - 1].absence = child.absence.filter((a)=> {
            return a.dateTo >= (new Date(new Date(Date.now()).setHours(23, 59, 59)).getTime()) && a.dateFrom <= Date.now()
          })
        })
      })
    return array;
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
