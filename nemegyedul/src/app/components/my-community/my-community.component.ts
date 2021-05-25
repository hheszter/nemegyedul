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

  friendRequests: Array<any>;
  friendRequestsToMe: Array<any>;
  confirmedFriends: Array<any>;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    const friendReqID = this.me.friends?.friendRequests;
    const friendReqToMeID = this.me.friends?.friendRequestsToMe;
    const confirmedID = this.me.friends?.friendLists;


    this.db.getData('users').subscribe(
      (data)=>{
        this.friendRequests = data.filter(user => friendReqID.includes(user.id));
        this.friendRequestsToMe = data.filter(user => friendReqToMeID.includes(user.id));
        this.confirmedFriends = data.filter(user => confirmedID.includes(user.id));
      }
    )
  }

}
