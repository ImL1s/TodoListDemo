import React, { useState, useRef } from 'react';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import { Keyboard } from '@capacitor/keyboard';
import './TodoInput.css';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');
  const [present] = useIonToast();
  const inputRef = useRef<HTMLIonInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      present({
        message: 'Please enter a todo item',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      return;
    }

    if (trimmedValue.length > 200) {
      present({
        message: 'Todo text is too long (max 200 characters)',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      return;
    }

    onAddTodo(trimmedValue);
    setInputValue('');

    // 在移動設備上隱藏鍵盤
    try {
      await Keyboard.hide();
    } catch (error) {
      // Keyboard plugin not available in web
    }

    // 重新聚焦輸入框
    setTimeout(() => {
      inputRef.current?.setFocus();
    }, 100);
  };

  return (
    <IonCard className="todo-input-card">
      <IonCardContent>
        <form onSubmit={handleSubmit}>
          <IonItem lines="none" className="input-item">
            <IonInput
              ref={inputRef}
              value={inputValue}
              placeholder="What needs to be done?"
              onIonInput={(e) => setInputValue(e.detail.value || '')}
              clearInput
              autocomplete="off"
              enterkeyhint="done"
              className="todo-input"
            />
            <IonButton
              slot="end"
              type="submit"
              color="primary"
              disabled={!inputValue.trim()}
            >
              <IonIcon slot="start" icon={addCircle} />
              Add
            </IonButton>
          </IonItem>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default TodoInput;
