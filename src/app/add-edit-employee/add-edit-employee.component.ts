import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { APIService } from '../api.service';

export class Employee {

  constructor(
  public userId: number,
  public speciality: string,
  public firstName: string,
  public lastName: string,
  public region: string,
  public dob : string,
  public email: string,
  public departmentId : number
  ){}
}
export interface Department {
  id: number,
  name: string,
  count : number
}

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css']
})
export class AddEditEmployeeComponent implements OnInit {

  injectedData : any;
  results : string = '';
  alert : boolean = false;
  departments : Department[] = [];
  model = new Employee(0,'','' ,'' ,'', '','' ,0);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,private dataService : APIService  ,private dialogRef: MatDialogRef<AddEditEmployeeComponent>) {

    console.log(data);
    this.getDepartments();
    this.injectedData = data;
    
    if(data != null || data != undefined)
    {
      this.model = new Employee(this.injectedData.data.id ,this.injectedData.data.speciality , this.injectedData.data.firstName, this.injectedData.data.lastName , this.injectedData.data.region,this.injectedData.data.dob, this.injectedData.data.email, this.injectedData.data.departmentId );

    }
   }

  ngOnInit(): void {
    
  }

  // This method is to toggle from view Employee to edit Employee.
  toggleMode()
  {
    this.injectedData.type = 'edit';
  }

  getEmployees(){
    this.dataService.getEmployees().subscribe(data => {
      this.dataService.employees = data;
    })
  }

    getDepartments()
    {
      this.dataService.getDepartments().subscribe((data: Department[]) => {

        this.departments = data;
        if(this.injectedData.data.departmentName == undefined &&  this.injectedData.type != 'add')
        {
          this.injectedData.data.departmentName =  this.departments.filter(x=>x.id == this.injectedData.data.departmentId)[0].name;
        }
      })
    }

  clearAlert()
  {
    setTimeout(() => {
      this.alert = false;
      this.results = "";
    },2000);

  }

  onSubmit(form: NgForm) {
    console.log('Your form data : ', form.value);
    if(this.injectedData.data.id == undefined)
    {
      console.log('add');
     this.dataService.addEmployees(form.value).subscribe(
       data =>  {  
           this.dataService.employees.push(data);
     //     this.getEmployees();
          this.results = "Employee Successfully Created" ;

            this.alert = true;
            setTimeout(() => {
              this.alert = false;
              this.results = "";
              this.dialogRef.close() ;
            },2000);
          
       }
     )
    } 
    else {
      console.log('update');
      this.dataService.updateEmployees(this.injectedData.data.id , form.value ).subscribe(
        data =>{ 
          console.log(data);
          this.results = "Employee Successfully Updated" ;
            this.alert = true;
            setTimeout(() => {
              this.alert = false;
              this.results = "";
              this.dialogRef.close() ;
            },2000);
        })
    }
  }

}
