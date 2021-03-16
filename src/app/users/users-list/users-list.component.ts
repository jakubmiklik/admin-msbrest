import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from 'src/app/user.service';

export interface DialogData {
  uid: string;
  displayName: string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  listOfUsers: Observable<any>;

  constructor(public router: Router, public dialog: MatDialog, public firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.listOfUsers = this.firestore.collection('users').valueChanges();
  }

  openDialog(uid: string, displayName: string) {
    this.dialog.open(Dialog, {
      data: {
        displayName: displayName, 
        uid: uid
      }
    });
    console.log(uid);
  }
  
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './dialog.html',
})
export class Dialog {
  constructor(
    public dialogRef: MatDialogRef<Dialog>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userService: UserService) {}

  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
