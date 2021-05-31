import { Component, OnInit } from '@angular/core';
import {  HttpClient  } from '@angular/common/http'; 
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog} from '@angular/material/dialog';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { APIService } from '../api.service';

export interface Employee {
  id: number,
  jobTitleName: string,
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

  values:any = [];
  EmployeesCount : number  = 0;
  employees : Employee[] = [];
  departments : Department[] = [];
  results : string = '';
  alert : boolean = false;
  departmentName : string  = 'All';
  constructor(private http: HttpClient , public dialog: MatDialog , public APIService : APIService ) {

    this.getEmployees();
    this.getDepartments();
   }

  ngOnInit(): void {
   
  }

  getDepartments()
  {
    this.http.get<Department[]>('http://localhost:3000/Departments',{responseType: 'json'})
    .subscribe((data: Department[]) =>{  
      this.getDepartmentCount(data) ;
    });

  }

  getDepartmentCount(departmentData)
  {
    this.APIService.getEmployees().subscribe(data => 
      {
        for(var item of departmentData)
          {
            item.count = data.filter(x => x.departmentId == item.id).length;
          }
          this.departments = departmentData;
          console.log('department' , this.departments);
      });
  }

  getEmployeesByDepartment(name : string)
  {
    console.log('see the name' , name);
    if(name == 'All' || name == '')
    {
      this.departmentName = 'All';
      this.getEmployees();
    }
    else 
    {
      this.APIService.getEmployees().subscribe(data => 
        {
          // this.APIService.employees = data.filter(x => x.departmentId == item.id) ;
          // this.employees = this.APIService.employees;
          // this.departmentName = this.departments.filter(x=> x.id == item.id)[0].name;
           this.departmentName = name;
           let departmentId = this.departments.filter(x=> x.name == name)[0].id;
           this.APIService.employees = data.filter(x => x.departmentId == departmentId) ;
           this.getDepartments();
      //     this.employees = this.APIService.employees;
       
        }
      );
    }
  }
  getEmployees() {

    this.APIService.getEmployees()
    .subscribe(
      data => {
        
        for(var item of data)
        {
          item.departmentName =  this.departments.filter(x=>x.id == item.departmentId)[0].name;
        }
        this.APIService.employees = data ;
        this.employees = this.APIService.employees;
        this.EmployeesCount = data.length;
      }
    );
   }

  openModalBox(type :string, data : Object)
  {
    console.log( 'in open' ,type , data );
    let modalBox = this.dialog.open( AddEditEmployeeComponent, {
      data : { type : type , data :data , selectedDepartment : this.departmentName},
      height : '600px',
      width : '600px'

    });
    modalBox.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getEmployeesByDepartment(this.departmentName);
    });

  }

  deleteEmployee(id:number)
  {
    console.log(id);
    this.APIService.deleteEmployees(id).subscribe(data => { 
        this.getEmployees();
        this.results = "Employee Deleted" ;
        this.alert = true;
            setTimeout(() => {
              this.alert = false;
              this.results = "";
            },2000);
      });
  }

  clearAlert()
  {
    setTimeout(() => {
      this.alert = false;
      this.results = "";
    },2000);

  }
  
  drop(event: CdkDragDrop<string[]>) {

    console.log(event , event.previousContainer.id, event.container);
    //  console.log( item,   'moved to' ,  event.currentIndex);
      if (event.previousContainer === event.container) {
        console.log('in the same source');
      //  moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     }
     else if(event.previousContainer.id === "cdk-drop-list-0")
     {
      this.results = "Department cannot be added to employees section." ;
          this.alert = true;
          this.clearAlert();
    }
      else {
       
        console.log('in the different source' , event.previousIndex ,  event.currentIndex);
        if(event.previousIndex != undefined && event.currentIndex != undefined && event.previousContainer.id === "cdk-drop-list-1")
        {
          var item =   this.APIService.employees[event.previousIndex];
          var department = this.departments[event.currentIndex];
          console.log(item,  event.previousIndex,  department , event.container.data);
          if(department == undefined)
          {
              this.results = "Please Drag and Drop on a Department";
              this.alert = true;
              this.clearAlert();
          }
          else if(item.departmentId == department.id)
          {
            this.results = "Employee " + item.firstName + " is already in " +  this.departments[event.currentIndex].name + " Department" ;
            this.alert = true;
            this.clearAlert();
          }
          else
          {

            this.results = "Employee " + item.firstName + " Moved to Department " +  this.departments[event.currentIndex].name ;

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
