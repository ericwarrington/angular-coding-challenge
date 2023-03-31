import { Component, OnInit } from "@angular/core";
import { catchError, map, reduce } from "rxjs/operators";

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
			.pipe(reduce((emps, e: Employee) => emps.concat(e), []))
			.pipe(map((emps) => this.employees = emps))
			.pipe(catchError((e) => this.handleError(e)))
			.subscribe();
	}

	private handleError(e: Error | unknown): string
	{
		console.error(e);
		return this.errorMessage = (e instanceof Error) ? e.message : "Unable to retrieve employees";
	}
}
