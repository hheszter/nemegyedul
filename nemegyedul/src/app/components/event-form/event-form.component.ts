import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { RoleGuardService } from 'src/app/services/role-guard.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, CanActivate {
  currentUser: any;
  newEventForm: FormGroup;
  categories: any;

  minDate: string;


  constructor(
    public router: Router,
    private db: DatabaseService
  ) {
    this.dateThingy();
  }

  dateThingy() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().substring(0, 16);
  }

  ngOnInit(): void {

    this.db.loggedInUser.subscribe(
      data => {
        this.currentUser = data
      }
    );

    this.newEventForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\.\- ]{4,120}$/)]),
      imageUrl: new FormControl('', [Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]),
      datetime: new FormControl('', [Validators.required, this.dateValidator.bind(this)]),
      shortDescription: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(80)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(800)]),
      location: new FormControl('', [Validators.required, Validators.pattern(/[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű]./)]),
      maxPeople: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(100000)]),
      category: new FormControl('', [Validators.required]),
      userUID: new FormControl(this.currentUser.userUID, [Validators.required]) // Hidden Field
    });

    this.db.getData('categories').subscribe(c => {
      this.categories = Array.from(new Map(Object.entries(c[0]))).filter(e => e[0] !== 'id');
    });
  }

  canActivate = (route: ActivatedRouteSnapshot): boolean => {

    const expectedRole = route.data.expectedRole;
    if (!this.currentUser || +this.currentUser.role < expectedRole) {
      this.router.navigate(["/main"]);
      return false;
    }
    return true;
  }

  dateValidator(datetime: FormControl) {
    const dateValue = datetime.value;

    if (new Date(this.minDate).getTime() > new Date(dateValue).getTime()) {
      return { 'InvalidDateError': true };
    }
    return null;
  }

  saveEvent() {
    const eventData = this.newEventForm.value;

    this.db.saveData('events', eventData);

    this.router.navigate(["/events"]);
  }

  cancelEventSave() {
    this.router.navigate(["/events"]);
  }
}
