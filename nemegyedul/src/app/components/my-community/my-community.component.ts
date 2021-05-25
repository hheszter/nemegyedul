import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-community',
  templateUrl: './my-community.component.html',
  styleUrls: ['./my-community.component.scss']
})
export class MyCommunityComponent implements OnInit {

  @Input() me:User;

  requestedFriends: Array<any>;
  confirmedFriends: Array<any>;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    const requestedFriendsIDs = this.me.friends?.friendRequests;
    const confirmedFriendsIDs = this.me.friends?.friendLists;

    console.log(requestedFriendsIDs)

    this.db.getData('users').subscribe(
      (data)=>{
        console.log(data);
        this.requestedFriends = data.filter(user => requestedFriendsIDs.includes(user.id));
        this.confirmedFriends = data.filter(user => confirmedFriendsIDs.includes(user.id));
      }
    )
  }

}
