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


  constructor(private dataService: DatabaseService) {
    this.dataService.loggedInUser.subscribe(
      data => { this.currentUser = data; this.myEventIdArray = data.myEvents},
      error => console.error(error)
    )

  }

  ngOnInit(): void {
    this.dataService.getData('events').subscribe(

      data => {
        this.eventArray = data;
        this.filterData(this.eventArray, this.currentUser, this.myEventArray)


      },
      error => console.error(error)
    )


    }
  filterData (eventArray, currentUser, myEventArray) {

    for(let j = 0; j< eventArray.length; j++) {
      //let i= 0
      //for (i= 0; i< currentUser.myEvents.length; i++) {
        // if(eventArray[j].id === currentUser.myEvents[i]) {
        if(eventArray[j].userUID === currentUser.userUID) {
          myEventArray.push(eventArray[j])
          //console.log(myEventArray)
        }
      //}
    }


  }


  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent
  }

  deleteEvent(selectedEvent) {

    this.currentUser.myEvents = this.currentUser.myEvents.filter(data => data != selectedEvent.id)
    this.dataService.updateData('users', this.currentUser.id, this.currentUser);
    this.myEventArray = this.myEventArray.filter(data => data.id !== selectedEvent.id)
    //console.log(this.currentUser)
  }

}
