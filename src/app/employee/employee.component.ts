import { Component, Input, OnInit } from "@angular/core";

import { Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { catchError, map, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";


@Component(
{
	selector: "app-employee",
	templateUrl: "./employee.component.html",
	styleUrls: ["./employee.component.css"]
})
export class EmployeeComponent implements OnInit
{
	@Input() employee: Employee;
	
	totalReporters$: Observable<number>;

	constructor(private employeeService: EmployeeService) {}

	ngOnInit(): void
	{
		this.totalReporters$ = this.employeeService.getAll()
			.pipe(catchError((e) => this.handleError(e)))
			.pipe(map((emp: Employee[]) => new Map<number, Employee>(emp.map((e) => [e.id, e]))))
			.pipe(map((empMap) =>
			{
				let visited = new Set<number>();
				let queue: Employee[] = [];
				const emp: Employee = empMap.get(this.employee.id) || {} as Employee;

				queue.push(emp);
				while(queue.length > 0)
				{
					const newEmp: Employee = queue.shift();
					if(visited.has(newEmp.id)) continue;
					visited.add(newEmp.id);
					queue.push(...newEmp.directReports?.map((id) => empMap.get(id)));
				}

				//Includes all reporters, plus the emp itself
				return visited.size - 1;
			}));
	}

	private handleError(e: Error | unknown): Observable<unknown>
	{
		console.error(e);
		return of({});
	}
}
