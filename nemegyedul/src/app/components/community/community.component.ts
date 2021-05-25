import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  dbSubscription: Subscription;
  allUser: Array<any>;
  me: User;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.dbSubscription = this.db.getData("users").subscribe(
      (data:any)=>{
        this.allUser=data;
        this.allUser.map( user => {
          user.category = Object.keys(user.category).filter( index => user.category[index])
        })
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    )

    this.dbSubscription = this.db.loggedInUser.subscribe(
      (data:any)=>{
        this.me=data;
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    )
  }

  setFriend(friend:User){
    console.log(this.me)
    console.log(friend)
    
    // az objektumban a category-t vissza kell állítani, így NEM JÓÓÓÓÓ >>> category-t máshogy mentse...
    
    this.me.friends = this.me.friends || {}
    this.me.friends.friendRequests = this.me.friends.friendRequests || [];
    if(this.me.friends.friendRequests.includes(friend.id)){
      alert("Már ismerősnek jelölted (vagy Ő téged!)")
    }
    this.me.friends.friendRequests.push(friend.id);
    this.db.updateData('users', this.me.id, this.me)
      .then(() => console.log('Add friend-request'))
      .catch(err => console.error(err))
    
    friend.friends = friend.friends || {};
    friend.friends.friendRequests = friend.friends.friendRequests || [];
    friend.friends.friendRequests.push(this.me.id);
    this.db.updateData('users', friend.id, friend)
      .then(() => console.log('Add friend-request'))
      .catch(err => console.error(err))



  }
}
