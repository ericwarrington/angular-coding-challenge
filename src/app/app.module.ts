import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { BackendlessMockService } from "./backendless-mock.service";
import { EmployeeComponent } from "./employee/employee.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeeService } from "./employee.service";
import { MaterialModule } from "./material.module.ts";

@NgModule(
{
	declarations:
	[
		AppComponent,
		EmployeeComponent,
		EmployeeListComponent
	],
	imports:
	[
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		HttpClientInMemoryWebApiModule.forRoot(BackendlessMockService,
		{
			apiBase: "api/",
			delay: 250,
			passThruUnknownUrl: true,
			post204: false,
			put204: false
		}),
		MaterialModule,
	],
	providers: [EmployeeService],
	bootstrap: [AppComponent]
})
export class AppModule {}
