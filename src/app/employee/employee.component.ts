import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { catchError, map, shareReplay, switchMap } from "rxjs/operators";
import { Observable, forkJoin, of } from "rxjs";


@Component(
{
	selector: "app-employee",
	templateUrl: "./employee.component.html",
	styleUrls: ["./employee.component.css"],
})
export class EmployeeComponent implements OnInit, OnDestroy
{
	@Input() employee: Employee;
	@Output("edit-reporter") editReporter = new EventEmitter<unknown>();
	@Output("delete-reporter") deleteReporter = new EventEmitter<number>();
	
	employeeMap$: Observable<Map<number, Employee>>;
	directReporters$: Observable<Array<Employee>>;
	totalReporters$: Observable<number>;

	constructor(private employeeService: EmployeeService) {}

	ngOnInit(): void
	{
		this.employeeMap$ = this.employeeService.getAll()
			.pipe(catchError((e) => this.handleError(e)))
			.pipe(map((emp: Employee[]) => new Map<number, Employee>(emp.map((e) => [e.id, e]))))
			.pipe(shareReplay());
			
		this.directReporters$ = forkJoin([this.employeeMap$, this.employeeService.get(this.employee.id)])
			.pipe(map(([empMap, emp]) => emp.directReports?.map((id) => empMap.get(id)).filter((e) => !!e) || []));

		this.totalReporters$ = this.employeeMap$
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

	ngOnDestroy(): void
	{
		this.editReporter.complete();
		this.deleteReporter.complete();
	}


	edit(): void
	{
		this.editReporter.emit();
	}

	delete(num: number): void
	{
		this.deleteReporter.emit(num);
	}

	private handleError(e: Error | unknown): Observable<unknown>
	{
		console.error(e);
		return of({});
	}
}
