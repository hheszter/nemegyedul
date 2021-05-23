import { Component, OnInit } from '@angular/core';
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
  eventArray: any[] = [
    {
    eventId: '1A', 
    eventName: 'Kötögetés Jucikánál',
    eventDate: "2021-06-30",
    shortDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
    longDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    eventLocation: "Nyíregyháza, Kossuth u. 2.",
    maxMember: 12,
    chategory: ["kötögetés", "kézi munka"],
    eventImageUrl: "https://mandiner.hu/attachment/0319/318879_kotogetes.jpg"
    },
    {
    eventId: '2A',
    eventName: 'Főzés Jucikánál',
    eventDate: "2021-07-12",
    shortDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
    longDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    eventLocation: "Nyíregyháza, Kossuth u. 2.",
    maxMember: 8,
    chategory: ["főzés", "gasztronómia"],
    eventImageUrl: "https://timmitotoro.files.wordpress.com/2010/09/julie-and-julia-2.jpg"
    },
    {
    eventId: '1B',
    eventName: 'Ivászat Buga Józsi pincéjében',
    eventDate: "2021-06-25",
    shortDescription: "Iszunk hányunk belefekszünk unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
    longDescription: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    eventLocation: "Debrecen, Vass Albert u. 25.",
    maxMember: 30,
    chategory: ["kultúra", "gasztronómia"],
    eventImageUrl: "https://lh3.googleusercontent.com/proxy/qQX299R9nHy-doefuggrDoaRe5MH81vjAQ_-4sMA1lw5RkczEeAX5ARw8ecOHh-AgtJvzlZZib_5lrT8IT3hXMna6o3jYqcnkpjkkfknuIlJFC83jOSSHvf78oqrdGteQWUFHbF8yECxYNxWUPMI3gKb6yqWHw"
    },
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
    },
  ];
  currentUser: any;
  selectedEvent: any = {};
  constructor(private dataService: DatabaseService) {
    
    
  }

  ngOnInit(): void {
    this.dataService.loggedInUser.subscribe(
      data => this.currentUser = data,
      error => console.error(error)
    )
  }
  
  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent;
  }
  
  saveEvent(selectedEvent) {
    
    //console.log(this.currentUser)
    //console.log(selectedEvent)
    //this.currentUser.myEvents = [];
    this.currentUser.myEvents.push(selectedEvent);
    this.dataService.updateData('users', this.currentUser.id, this.currentUser)
    
    console.log(this.currentUser)

  }


}
