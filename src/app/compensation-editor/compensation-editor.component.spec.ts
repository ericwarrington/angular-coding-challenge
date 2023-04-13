import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompensationEditorComponent } from "./compensation-editor.component";

describe("CompensationEditorComponent", () =>
{
	let component: CompensationEditorComponent;
	let fixture: ComponentFixture<CompensationEditorComponent>;

	beforeEach(async(() =>
	{
		TestBed.configureTestingModule({ declarations: [CompensationEditorComponent] }).compileComponents();
	}));

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(CompensationEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () =>
	{
		expect(component).toBeTruthy();
	});
});
