import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  allUser: Array<any>;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.db.getData("users").subscribe(
      (data:any)=>{
        this.allUser=data;
        this.allUser.map( user => {
          user.category = Object.keys(user.category).filter( index => user.category[index])
        })
      },
      (err:any)=>console.error(err)
    )
  }

  setFriend(user:User){
    console.log("ismerősöd lett: " + user)
  }
}
