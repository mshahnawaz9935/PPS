# People Management System

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.5.
To install all the dependencies please use the command **npm install** from the root directory. Make sure that NodeJS is pre-installed.

## Introduction

The idea behind this project was to develop a management system for managing Employees called People Management System.
The home page of the application will display information about Departments on the left side and Employees on the right side.

Three Departments were added by me for testing but more can be added by editing the employees.json file and add a new department as **{ id : 4, name : 'Machinery' }**.
On the left side Department's name and number of employees in the department is displayed.

On the right side the employee details such as Name, Region, Job , DOB and Department Name is displayed.
The functionalities to add,edit and delete an employee has been implemented and fully functional.

## Drag and Drop Functionality

For the Drag and drop functionality, if the employeee name is dragged on top of the department name then the programming logic will 
check the target Department and if all the conditions are statisfied then the employee will be moved to the new department and the 
counts and the values will get updated.

Angular @angular/cdk/drag-drop module was used to accomplissh this task.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Mocked REST APIS
Json-server npm module was used to mock the Rest APIS. All the data is contained in the employees.json file.
It has two datasets which are Employees and Departments.

To install the package use this command **npm install -g json-server** from the root directory.

To run the mock server use this command **json-server --nocors --watch employees.json** from the root directory.

The url for Employees are '**http://localhost:3000/Employees**' and for the Departments are '**http://localhost:3000/Departments**'.
It supports HTTP GET, PUT , POST AND DELETE requests.


## Automated Testing using Selenium C#

To run this projects few things are needed first.
**ChromeDriver** which can be downloaded from the internet and make sure to copy it at the path C:\\.
Nuget packages needed for Automated UI Testing are **Selenium.WebDriver** and **Selenium.WebDriver.Support**.

Before running the tests please make sure that the Angular client project is running on **localhost:4200** and Json-server is running on **localhost:3000**.

It contains three Unit Tests for the UI which AddEmployee, EditEmployeeDepartment and DeleteEmployee.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
