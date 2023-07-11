import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMenuEntregaPage } from './add-menu-entrega.page';

describe('AddMenuEntregaPage', () => {
  let component: AddMenuEntregaPage;
  let fixture: ComponentFixture<AddMenuEntregaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMenuEntregaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMenuEntregaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
