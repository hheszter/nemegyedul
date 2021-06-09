import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {
  eventArray: any[] = [];
  myEventArray: any[] = [];
  myEventIdArray: any[] = [];
  currentUser: User = {
    id: '',
    age: 0,
    category: [],
    city: '',
    email: '',
    gender: '',
    name: '',
    role: '',
    photo: '',
    date: '',
    userUID: '',
    myEvents: []
  };
  selectedEvent: any = {};
  users: any[] = [];
  filteredUsers: any[] = [];
  localeDate: any;

  constructor(private dataService: DatabaseService) {
    this.dataService.loggedInUser.subscribe(
      data => { this.currentUser = data; this.myEventIdArray = data.myEvents },
      error => console.error(error)
    )

  }

  ngOnInit(): void {
    this.dataService.getData('users').subscribe(
      data => this.users = data,
      error => console.error(error)
    )

    this.dataService.getData('events').subscribe(
      data => {
        this.eventArray = data;
        this.filterData(this.eventArray, this.currentUser, this.myEventArray)
      },
      error => console.error(error)
    )
  }

  filterData(eventArray, currentUser, myEventArray) {
    for (let j = 0; j < eventArray.length; j++) {
      if (eventArray[j].userUID === currentUser.userUID) {
        eventArray[j].datetime = new Intl.DateTimeFormat('hu-HU').format(Date.parse(eventArray[j].datetime));
        myEventArray.push(eventArray[j]);
      }
    }
  }

  filterUsers(event) {
    this.filteredUsers = [];
    this.selectedEvent = event;
    let i = 0;
    for (i = 0; i< this.users.length; i++) {
      for (let k = 0; k < this.users[i].myEvents.length; k++) {
        if (this.users[i].myEvents[k] === event.id) {
          this.filteredUsers.push(this.users[i])
        }
      }
    }
  }

  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent;
    this.localeDate = new Intl.DateTimeFormat('hu-HU').format(Date.parse(selectedEvent.datetime));
  }

  deleteEvent(selectedEvent) {
    this.currentUser.myEvents = this.currentUser.myEvents.filter(data => data != selectedEvent.id)
    this.dataService.updateData('users', this.currentUser.id, this.currentUser);
    this.myEventArray = this.myEventArray.filter(data => data.id !== selectedEvent.id)

    this.dataService.deleteData('events', selectedEvent.id)
  }
}
