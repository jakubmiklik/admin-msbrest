import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { FileParameters, FireStorageService } from 'src/app/firestorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {

  inputText = 'Přidat soubory';
  filesArray: FileParameters[] = [];
  acceptFileType = '.doc, .docx, .pdf, .txt';

  constructor(
    public fireStorageService: FireStorageService, 
    public router: Router, 
    public storage: AngularFireStorage, 
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void { 
  }

}
