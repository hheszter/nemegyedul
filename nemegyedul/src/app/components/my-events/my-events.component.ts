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


  constructor(private dataService: DatabaseService) {
    this.dataService.loggedInUser.subscribe(
      data => { this.currentUser = data;this.eventArray = this.currentUser.myEvents},
      error => console.error(error)
    )
    
  }
  
  ngOnInit(): void {
    
  }

  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent
  }

  deleteEvent(selectedEvent) {
    console.log(this.currentUser)
    console.log(selectedEvent)
  }

}
