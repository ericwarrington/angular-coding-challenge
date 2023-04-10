import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";

import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
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

	constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

	ngOnInit(): void
	{
		this.employeeService.getAll()
			.pipe(catchError((e) => this.handleError(e)))
			.subscribe((emps) => this.employees = emps);
	}

	edit(): void
	{
		//Not the best, implementation-wise, but it shows that the Events are working properly
		//  in the absence of requirements for editing reporters
		alert("edit");
	}

	delete(emp: Employee, reporterIndex: number): void
	{
		this.dialog.open(ConfirmDialogComponent, { height: "250px", width: "400px" }).afterClosed()
			.pipe(filter((val: boolean) => !!val))
			.subscribe(() => 
			{
				let directReports = [...emp.directReports];
				directReports.splice(reporterIndex, 1);

				this.employeeService.save({ ...emp, directReports })
					.pipe(switchMap(() => this.employeeService.getAll()))
					.pipe(catchError((e) => this.handleError(e)))
					.subscribe((emps) => this.employees = emps);
			});
	}

	private handleError(e: Error | unknown): Observable<Array<Employee>>
	{
		console.error(e);
		this.errorMessage = e instanceof Error ? e.message : "Unable to retrieve employees.";
		return of([]);
	}
}
