import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) { }

  createUser(email: string, firstName: string, lastName: string, children: Child[]){
    const password = this.generatePassword(10);
    this.http.post('https://us-central1-skolka-brest.cloudfunctions.net/app/users/createUser',{
      email: email,
      password: password,
      displayName: `${firstName} ${lastName}`,
      children: children
    }).subscribe();
  }

  editUser(uid: string, email: string, firstName: string, lastName: string, children: Child[]){
    this.http.post(`https://us-central1-skolka-brest.cloudfunctions.net/app/users/editUser/${uid}`, {
      email: email,
      displayName: `${firstName} ${lastName}`,
      children: children
    }).subscribe();
  }

  getUser(uid: string){
    const url = `https://us-central1-skolka-brest.cloudfunctions.net/app/users/getUser/${uid}`;
    return this.http.get(url).toPromise();
  }

  removeUser(uid: string){
    const url = `https://us-central1-skolka-brest.cloudfunctions.net/app/users/deleteUser/${uid}`;
    return this.http.get(url).subscribe();
  }

  generatePassword(length: number): string {
    let output = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      output += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return output;
  }
}

export interface Child {
  id?: string;
  name: string;
}