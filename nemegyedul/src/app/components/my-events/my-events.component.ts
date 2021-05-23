import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {
  eventArray: any[] = [
    {
      eventId: '1C',
      eventName: 'Tenyérjóslás Magdival',
      eventDate: "2021-06-30",
      shortDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
      longDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      eventLocation: "Budapest, VIII. ker. Dohány u. 86.",
      maxMember: 10,
      chategory: ["asztrológia"],
      eventImageUrl: "https://eletforma.hu/wp-content/uploads/2018/09/1_osszes512.jpg"
      }
  ];
  currentUser: any = {};
  selectedEvent: any = {};


  constructor(private dataService: DatabaseService) {
    
  }
  
  ngOnInit(): void {
    this.dataService.loggedInUser.subscribe(
      data => { this.currentUser = data;this.eventArray = this.currentUser.myEvents},
      error => console.error(error)
    )
    
  }

  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent
  }

  deleteEvent(selectedEvent) {
    console.log(this.currentUser)
    console.log(selectedEvent)
  }

}
