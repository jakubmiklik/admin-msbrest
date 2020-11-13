import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'admin-msbrest';
  isAdmin = false;
  loggedIn = false;
  subscription: Subscription;
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

  links = [
    {link: '', name: 'Domů'},
    {link: '/omluvenky', name: 'Omluvenky'},
    {link: '/aktuality', name: 'Aktuality'},
    {link: '/dokumenty', name: 'Dokumenty'},
    {link: '/fotogalerie', name: 'Fotogalerie'},
    {link: '/mesicni-plany', name: 'Měsíční plány'}
  ]

  constructor(public fireAuth: AngularFireAuth, public firestore: AngularFirestore, public cookie: CookieService, public router: Router){
    if(cookie.check('token')){
      this.subscription = fireAuth.user.subscribe(user => {
        this.loggedIn = user.refreshToken === cookie.get('token') ? true : false;
        this.isAdmin = true;
     });
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmit(){

    this.fireAuth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then((auth)=>{
      this.subscription = this.firestore.doc(`users/${auth.user.uid}`).get().subscribe(doc => {
        this.isAdmin = doc.get('isAdmin') as boolean;
        if(!this.isAdmin){
          alert('Nemáte přístup k tomuto webu.');
        } else {
          this.cookie.set('token', (auth.user.refreshToken as string), null, '/');
          this.loggedIn = true;
        }
      })
    }).catch((e)=>{
      alert('Nemáte přístup k tomuto webu.');
      location.reload();
    })

    
    
  }
}
