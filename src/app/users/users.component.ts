import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Employee {
  userId: number,
  jobTitleName: string,
  firstName: string,
  lastName: string,
  preferredFullName: string,
  employeeCode: string,
  region: string,
  phoneNumber: number,
  emailAddress: string
}

export interface Department {
  id: number,
  name: string,
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  employees : Employee[] = [];
  departments : Department[] = [];
  results : string = '';
  alert : boolean = false;
  constructor(private http: HttpClient) {

    this.http.get<Employee[]>('http://localhost:3000/Employees',{responseType: 'json'})
    .subscribe((data: Employee[]) =>{  this.employees = data ;
      console.log(data);
    });

    this.http.get<Department[]>('http://localhost:3000/Departments',{responseType: 'json'})
    .subscribe((data: Department[]) =>{  this.departments = data ;
      console.log(data);
    });

   }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {

    console.log(event);
  //  console.log( item,   'moved to' ,  event.currentIndex);
    if (event.previousContainer === event.container) {
      console.log('in the same source');
    //  moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
   } 
    else {
     
      console.log('in the different source' , event.previousIndex ,  event.currentIndex);
      if(event.previousIndex != undefined && event.currentIndex != undefined)
      {
        var item =   this.employees[event.previousIndex];
        var departmentName = this.departments[event.currentIndex];
        console.log(item,  event.previousIndex,  departmentName , event.container.data);

        if(departmentName == undefined)
        this.results = "Please Drag and Drop on a Department";
        else
        this.results = "Employee " + item.preferredFullName + " Moved to Department " +  this.departments[event.currentIndex].name ;

        if(this.results != "")
        {
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
          this.results = "";
        },2000);
    }
    }


    //  transferArrayItem(event.previousContainer.data,
      //                  event.container.data,
       //                 event.previousIndex,
       //                 event.currentIndex);
    }
  }

}
