import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  get addUser(){
    return this.router.url.includes('pridat');
  }

  uid = '';
  firstName = new FormControl('');
  lastName = new FormControl('');
  email = new FormControl('');
  user: User;

  constructor(
    public userService: UserService, 
    public router: Router, 
    public route: ActivatedRoute,
    public firestore: AngularFirestore
  ) { }

  async ngOnInit() {
    this.uid = await this.getUID();
    this.user = await this.getUser((this.uid)) as User;
    let name = this.user.displayName.split(' ');
    this.firstName = new FormControl(name[0]);
    this.lastName = new FormControl(name[1]);
    this.email = new FormControl(this.user.email);
    this.user.children = [];
    const children = await this.firestore.collection(`users/${this.uid}/children`).ref.get();
    children.docs.forEach(child => {
      const childData = child.data();
      this.user.children.push({id: childData.id, name: childData.name, formControl: new FormControl(childData.name)});
    })
  }

  addChild(){
    this.user.children.push({name: '', formControl: new FormControl('')});
  }

  deleteChild(index: number){
    if(!this.addUser){
      this.firestore.doc(`users/${this.uid}/children/${this.user.children[index].id}`).delete();
    }
    this.user.children.splice(index, 1);
  }

  async getUID() {
    let uid = '';
    this.route.paramMap.subscribe((params) => {
      uid = params.get('uid');
    });
    return uid;
  }

  async getUser(uid: string){
    return this.userService.getUser(uid);
  }

  saveUser(){
    this.user.children.forEach((child, index) => {
      this.user.children[index].name = child.formControl.value;
      delete this.user.children[index].formControl;
    })
    if(this.addUser){
      this.userService.createUser(this.email.value, this.firstName.value, this.lastName.value, this.user.children);
    } else {
      console.log(this.user.children);
      this.userService.editUser(this.uid, this.email.value, this.firstName.value, this.lastName.value, this.user.children);
    }
    this.router.navigate(['/uzivatele']);
  }
}

export interface User {
  authToken: string;
  displayName: string;
  email: string;
  children: Child[];
}

export class User {
  constructor(public uid: string, public children: Child[]){}
}

export interface Child {
  id?: string;
  name: string;
  formControl?: FormControl;
}
