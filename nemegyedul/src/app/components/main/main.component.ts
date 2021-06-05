import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { RoleGuardService } from 'src/app/services/role-guard.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  eventArray: any[] = [];
  tempArray: any[] = [];
  currentUser: any;
  selectedEvent: any = {};
  currentUserEvents: any[] = [];
  categoriesList: any[] = [];
  currentCategory: any[] = [];
  buttonDisable: boolean = false;
  localeDate: any;
  formCategory: FormGroup;

  constructor(private dataService: DatabaseService) {
    this.formCategory = new FormGroup({
      category: new FormControl('')
    })

  }

  ngOnInit(): void {
    this.dataService.loggedInUser.subscribe(
      data => {this.currentUser = data},
      error => console.error(error)
    )
    this.dataService.getData('categories').subscribe(
      data => {
        this.categoriesList = Array.from(new Map(Object.entries(data[0]))).filter(e => e[0] !== 'id');

        this.currentCategory = this.categoriesList.sort();
      },
      error => console.error(error)
    )

    this.dataService.getData('events').subscribe(
      data => {
        this.tempArray = data
        this.eventArray = [];
        const dateNow = Date.now();
        for (let i=0; i< this.tempArray.length; i++) {
          if(dateNow <= Date.parse(this.tempArray[i].datetime) ) {
            this.tempArray[i].datetime = new Intl.DateTimeFormat('hu-HU').format(Date.parse(this.tempArray[i].datetime))
             this.eventArray.push(this.tempArray[i])
          }
        }

      },
      error => console.error(error)
    )
  }

  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent;
    this.localeDate = this.selectedEvent.datetime;
     for (let i = 0; i < this.currentUser.myEvents.length; i++) {
       if (this.currentUser.myEvents[i] === selectedEvent.id) {
         this.buttonDisable = true;
       }
    }
  }

  close() {
    this.buttonDisable = false;
  }

  saveEvent(selectedEvent) {
    let selectedEventId = selectedEvent.id
    this.currentUser.myEvents.push(selectedEventId);
    this.dataService.updateData('users', this.currentUser.id, this.currentUser)
  }

  selectCategory() {
    let selected = this.formCategory.value;
    if (selected.category === "") {
      this.dataService.getData('categories').subscribe(
        data => {
          this.categoriesList = Array.from(new Map(Object.entries(data[0]))).filter(e => e[0] !== 'id');
          this.currentCategory = this.categoriesList;
        },
        error => console.error(error)
      )
    } else {
      this.dataService.getData('categories').subscribe(
        data => {
          this.categoriesList = Array.from(new Map(Object.entries(data[0]))).filter(e => e[0] !== 'id');
          this.currentCategory = this.categoriesList.filter(data => data[0] === selected.category)

        },
        error => console.error(error)
      )

    }
  }


}
