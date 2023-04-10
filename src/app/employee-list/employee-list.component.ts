import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Employee} from "../employee";
import { EmployeeService } from "../employee.service";

@Component(
{
	selector: "app-employee-list",
	templateUrl: "./employee-list.component.html",
	styleUrls: ["./employee-list.component.css"]
})
export class EmployeeListComponent implements OnInit
{
	employees: Employee[] = [];
	errorMessage: string;

	constructor(private employeeService: EmployeeService) {}

	ngOnInit(): void
	{
		this.employeeService.getAll()
			.pipe(catchError((e) => this.handleError(e)))
			.subscribe((emps) => this.employees = emps);
	}

	private handleError(e: Error | unknown): Observable<Array<Employee>>
	{
		console.error(e);
		this.errorMessage = e instanceof Error ? e.message : "Unable to retrieve employees.";
		return of([]);
	}
}
