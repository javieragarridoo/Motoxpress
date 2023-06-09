import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecogidaComponent } from './recogida.component';

describe('RecogidaComponent', () => {
  let component: RecogidaComponent;
  let fixture: ComponentFixture<RecogidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecogidaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecogidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
