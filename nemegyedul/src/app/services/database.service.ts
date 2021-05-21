import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  dbSubsciption: Subscription | undefined;
  currentUser: any;
  currentUserArray: any[];
  
  constructor(private firestore: AngularFirestore) { 
    
    
  }
  currentuser() {
    this.getData('users').subscribe(
      
        (data:any) => {
          this.currentUserArray = data;
          console.log(this.currentUserArray)
          this.currentUser = this.currentUserArray.filter(data => data.userUID === window.localStorage.getItem("app_user_uid"))[0];
          console.log(+this.currentUser.role)
        }
    )

  }

  
  getData(collection:string){
    return this.firestore.collection(collection).valueChanges({idField: "id"})
  }

  getOneDataById(collection:string, id:string){
    return this.firestore.collection(collection).doc(id).get()
  }

  saveData(collection:string, data:any){
    return this.firestore.collection(collection).add(data)
  }

  updateData(collection:string, id:string, data:any){
    return this.firestore.collection(collection).doc(id).set(data)
  }

  deleteData(collection:string, id:string){
    return this.firestore.collection(collection).doc(id).delete()
  }

  //get user data by auth UID:
  //(app_user_uid is stored in local storage!)
  getUserByUID(uid:string, collection:string = "users"){
    let loggedInUser = {};
    this.dbSubsciption = this.getData(collection).subscribe(
      (doc:any) => {
        doc.forEach((user:any)=>{
         
          
            if(user.userUID === uid){
              loggedInUser = user
              console.log(user)
              
          }
        });
      },
      (err)=>{
        console.error(err)
      },
      
    );
    console.log(loggedInUser)
    return loggedInUser
  }



}
