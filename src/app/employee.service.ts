import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { Employee } from "./employee";

@Injectable()
export class EmployeeService
{
	private url = "/api/employees";

	constructor(private http: HttpClient) {}

	public getAll(): Observable<Array<Employee>>
	{
		return this.http.get<Array<Employee>>(this.url)
			.pipe(catchError((e) => this.handleError(e)));
	}

	public get(id: number): Observable<Employee>
	{
		return this.http.get<Employee>(`${this.url}/${id}`)
			.pipe(catchError(this.handleError));
	}

	public save(emp: Employee): Observable<Employee>
	{
		const response = (!!emp.id) ? this.put(emp) : this.post(emp);
		return response.pipe(catchError(this.handleError));
	}

	public remove(emp: Employee): Observable<never>
	{
		return this.http.delete<never>(`${this.url}/${emp.id}`)
			.pipe(catchError(this.handleError));
	}

	private post(emp: Employee): Observable<Employee>
	{
		return this.http.post<Employee>(this.url, emp);
	}

	private put(emp: Employee): Observable<Employee>
	{
		return this.http.put<Employee>(`${this.url}/${emp.id}`, emp);
	}

	private handleError(res: HttpErrorResponse | any): Observable<never>
	{
		return throwError(res.error || "Server error");
	}
}
