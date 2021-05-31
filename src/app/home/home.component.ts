import { Component, OnInit } from '@angular/core';
import {  HttpClient  } from '@angular/common/http'; 
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog} from '@angular/material/dialog';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { APIService } from '../api.service';

export interface Employee {
  id: number,
  speciality: string,
  firstName: string,
  lastName: string,
  region: string,
  emailAddress: string,
  departmentId : number,
  departmentName :string
}

export interface Department {
  id: number,
  name: string,
  count : number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  EmployeesCount : number  = 0;
  employees : Employee[] = [];
  departments : Department[] = [];
  results : string = '';
  alert : boolean = false;
  departmentName : string  = 'All';          // Show Employees in all departments by default.

  constructor(private http: HttpClient , public dialog: MatDialog , public APIService : APIService ) {
    this.getEmployees();
   }

  ngOnInit(): void {
  }

  //Gets the count of employees in the department
  getDepartmentCount(departmentData)
  {
    this.APIService.getEmployees().subscribe(data => {
        for(var item of departmentData)
        {
            item.count = data.filter(x => x.departmentId == item.id).length;
        }
          this.departments = departmentData;
      });
  }

  //Gets the employees in each department
  getEmployeesByDepartment(name : string)
  {
    if(name == 'All' || name == '')
    {
      this.departmentName = 'All';
      this.getEmployees();
    }
    else 
    {
      this.APIService.getEmployees().subscribe(data => 
        {
           this.departmentName = name;
           let departmentId = this.departments.filter(x=> x.name == name)[0].id;
           this.APIService.employees = data.filter(x => x.departmentId == departmentId) ;
           this.getDepartmentCount(this.departments);
        }
      );
    }
  }

  // To get all employees data
  getEmployees() {

    this.APIService.getEmployees().subscribe(data => {
        this.APIService.getDepartments().subscribe((departmentData: Department[])=> {
          this.departments = departmentData;
          for(var item of data)
          {
            // To get the department names from Department Id
            item.departmentName =  departmentData.filter(x=>x.id == item.departmentId)[0].name;
          }
          this.APIService.employees = data ;
          this.employees = this.APIService.employees;
          this.EmployeesCount = data.length;
          this.getDepartmentCount(departmentData);
        });
      });
   }

  openModalBox(type :string, data : Object)      // Opnes a modal box to Add or Edit Employee.
  {
    console.log( 'in open' ,type , data );
    let modalBox = this.dialog.open( AddEditEmployeeComponent, {
      data : { type : type , data :data , selectedDepartment : this.departmentName},
      height : '630px',
      width : '600px'

    });
    modalBox.afterClosed().subscribe(result => {           // Actions performed when modal box is closed
      console.log(`Dialog result: ${result}`);
      this.getEmployeesByDepartment(this.departmentName);
      if(type =='add')
      {
        // After employee has been added then increase the total employees count by 1.
        this.EmployeesCount = this.EmployeesCount + 1;
      }
    });

  }

  deleteEmployee(id:number)      // To delete employee
  {
    console.log(id);
    this.APIService.deleteEmployees(id).subscribe(data => { 
        this.results = "Employee Deleted" ;
        this.alert = true;
         // After employee has been removed then decrease the total employees count by 1.
        this.EmployeesCount = this.EmployeesCount - 1;
        this.getEmployeesByDepartment(this.departmentName);
        this.clearAlert();
      });
  }

  clearAlert()      // Clear the alert message after two seconds.
  {
    setTimeout(() => {
      this.alert = false;
      this.results = "";
    },2000);

  }
  
  drop(event: CdkDragDrop<string[]>) {         // For moving employee from one department to another

      if (event.previousContainer === event.container) {
        // When the source and destination of drag and drop is same. Nothing is done in this case.
        console.log('in the same source');
     }
     else if(event.previousContainer.id === "cdk-drop-list-0")
     {
       // To make sure that the departments aren't dropped into the employees section.
      this.results = "Department cannot be added to employees section." ;
          this.alert = true;
          this.clearAlert();
    }
      else {
       
        if(event.previousIndex != undefined && event.currentIndex != undefined && event.previousContainer.id === "cdk-drop-list-1")
        {
          var item =   this.APIService.employees[event.previousIndex];
          var department = this.departments[event.currentIndex];
          if(department == undefined)
          {
              // If the drop fails to reach the target
              this.results = "Please Drag and Drop on a Department";
              this.alert = true;
              this.clearAlert();
          }
          else if(item.departmentId == department.id)
          {
            // If the employee is already in the same department.
            this.results = "Employee <b>" + item.firstName + "</b> is already in " +  this.departments[event.currentIndex].name + " Department" ;
            this.alert = true;
            this.clearAlert();
          }
          else
          {
            // Perform PUT Request to change Employee's department.
            this.results = "Employee <b>" + item.firstName + "</b> Moved to Department " +  this.departments[event.currentIndex].name ;

            item.departmentId = department.id;
            this.alert = true;
            this.APIService.updateEmployees(item.id , item).subscribe(
            data =>{ 
              console.log(data);
                this.getEmployeesByDepartment(department.name);
                
                this.clearAlert();
              });
          } 
      }
      //  transferArrayItem(event.previousContainer.data,
        //                  event.container.data,
         //                 event.previousIndex,
         //                 event.currentIndex);
      }
    }

}
