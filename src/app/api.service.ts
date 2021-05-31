import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';

export interface Employee {
  id: number,
  speciality: string,
  firstName: string,
  lastName: string,
  region: string,
  emailAddress: string,
  departmentId : number,
  departmentName : string
}

export interface Department {
  id: number,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  employees : Employee[] = [];
  constructor(private http: HttpClient) {
    console.log('in the Service');
   }

   getEmployees() {
    return  this.http.get<Employee[]>('http://localhost:3000/Employees',{responseType: 'json'});
   }

   getDepartments() {
    return  this.http.get<Department[]>('http://localhost:3000/Departments',{responseType: 'json'});
   }

   deleteEmployees(id:number)
   {
     return this.http.delete<Employee>('http://localhost:3000/Employees/'+ id,{responseType: 'json'})
   }

   addEmployees(data:Employee) {

    return this.http.post<Employee>('http://localhost:3000/Employees', data,{responseType: 'json'});
   }

   updateEmployees(id:number , data:Employee) {

    return this.http.put<Employee>('http://localhost:3000/Employees/' + id, data,{responseType: 'json'});
   }
}

