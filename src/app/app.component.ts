import { Component, HostListener, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('menu', [
      state('hide', style({
        height: '0',
        visibility: 'hidden'
      })),
      state('show', style({
        height: '365px',
        visibility: 'visible',
        top: '60px'
      })),
      transition('show <=> hide', animate('350ms ease-in'))
    ]),
    trigger('sub-menu', [
      state('hide', style({
        opacity: 0,
        visibility: 'hidden',
        height: 0
      })),
      state('show', style({
        opacity: 1,
        height: 'auto'
      })),
      transition('show <=> hide', animate('350ms ease-in'))
    ]),
    trigger('showUserMenu', [
      state('hide', style({
        visibility: 'hidden',
        opacity: 0,
        height: '0px'
      })),
      state('show', style({
        visibility: 'visible',
        opacity: 1,
        height: 'auto'
      })),
      transition('show <=> hide', animate('350ms ease-in'))
    ])
  ]
})
export class AppComponent implements OnDestroy {

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = window.innerWidth;
  }

  get stateName(){ return this.show ? 'show' : 'hide'; }

  show = false;
  title = 'admin-msbrest';
  isAdmin = false;
  loggedIn = false;
  width = window.innerWidth;
  device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  subscription: Subscription;
  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  })

  links = [
    {link: '/', name: 'Domů'},
    {link: '/omluvenky', name: 'Omluvenky'},
    {link: '/aktuality', name: 'Aktuality'},
    {link: '/dokumenty', name: 'Dokumenty'},
    {link: '/fotogalerie', name: 'Fotogalerie'},
    {link: '/mesicni-plany', name: 'Měsíční plány'},
    {link: '/uzivatele', name: 'Uživatelé'}
  ]

  constructor(
    public fireAuth: AngularFireAuth, 
    public firestore: AngularFirestore,
    public storage: AngularFireStorage, 
    public cookie: CookieService, 
    public router: Router, 
    public _location: Location
  ){
    
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

  toggle() {
    this.show = !this.show;
  }


  back(){
    this._location.back();
  }

  logOut() {
    this.fireAuth.signOut();
    this.cookie.delete('token');
    this.isAdmin = false;
    this.router.navigate(['']);
  }
}
