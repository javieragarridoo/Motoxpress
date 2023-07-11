import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRecogidaPage } from './add-recogida.page';

describe('AddRecogidaPage', () => {
  let component: AddRecogidaPage;
  let fixture: ComponentFixture<AddRecogidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecogidaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecogidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
