import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Registration {
  groupName: string;
  participants: string;
  option: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container">
      <h1>Trot 2025 Registration</h1>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="groupName">Group Name:</label>
          <input 
            type="text" 
            id="groupName" 
            [(ngModel)]="registration.groupName" 
            name="groupName" 
            required>
        </div>

        <div class="form-group">
          <label for="participants">Participant Names (one per line):</label>
          <textarea 
            id="participants" 
            [(ngModel)]="registration.participants" 
            name="participants" 
            rows="5" 
            required></textarea>
        </div>

        <div class="options-container">
          <div class="radio-option">
            <input 
              type="radio" 
              id="langLang" 
              name="option" 
              value="lang/lang" 
              [(ngModel)]="registration.option">
            <label for="langLang">Lang/Lang</label>
          </div>

          <div class="radio-option" *ngFor="let opt of movingOptions; let i = index">
            <input 
              type="radio" 
              [id]="'option' + i" 
              name="option" 
              [value]="opt" 
              [(ngModel)]="registration.option"
              (mouseenter)="moveOption($event)">
            <label 
              [for]="'option' + i" 
              (mouseenter)="moveOption($event)">
              {{opt}}
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          class="submit-button"
          [disabled]="!isFormValid()">
          Register
        </button>
      </form>

      <div *ngIf="submitted">
        <h2>Registration Successful!</h2>
        <p>Group: {{ registration.groupName }}</p>
        <p>Option: {{ registration.option }}</p>
        <h3>Participants:</h3>
        <ul>
          <li *ngFor="let participant of getParticipantsList()">
            {{ participant }}
          </li>
        </ul>
      </div>
    </div>
  `
})
export class App {
  registration: Registration = {
    groupName: '',
    participants: '',
    option: ''
  };
  submitted = false;
  movingOptions = ['Kort/Lang', 'Lang/Kort', 'Kort/Kort'];

  moveOption(event: MouseEvent) {
    const element = event.target as HTMLElement;
    const radioOption = element.closest('.radio-option') as HTMLElement;
    
    if (radioOption && !radioOption.querySelector('#langLang')) {
      const offsetX = (Math.random() - 0.5) * 500;
      const offsetY = (Math.random() - 0.5) * 500;
      
      radioOption.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      
      setTimeout(() => {
        radioOption.style.transform = 'translate(0, 0)';
      }, 200);
    }
  }

  isFormValid(): boolean {
    return this.registration.groupName.trim() !== '' &&
           this.registration.participants.trim() !== '' &&
           this.registration.option === 'lang/lang';
  }

  getParticipantsList(): string[] {
    return this.registration.participants
      .split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.submitted = true;
      console.log('Registration submitted:', this.registration);
    }
  }
}

bootstrapApplication(App);