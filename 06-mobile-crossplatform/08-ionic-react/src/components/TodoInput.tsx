import React, { useState, useRef, useCallback } from 'react';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { addCircle } from 'ionicons/icons';
import { Keyboard } from '@capacitor/keyboard';
import { useToast } from '../hooks';
import './TodoInput.css';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLIonInputElement>(null);
  const { showWarning, showError } = useToast();

  // 使用 useCallback 优化函数引用
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedValue = inputValue.trim();

      if (!trimmedValue) {
        showWarning('Please enter a todo item');
        return;
      }

      if (trimmedValue.length < 3) {
        showWarning('Todo must be at least 3 characters');
        return;
      }

      if (trimmedValue.length > 200) {
        showError('Todo text is too long (max 200 characters)');
        return;
      }

      onAddTodo(trimmedValue);
      setInputValue('');

      // 在移动设备上隐藏键盘
      try {
        await Keyboard.hide();
      } catch (error) {
        // Keyboard plugin not available in web
      }

      // 重新聚焦输入框
      setTimeout(() => {
        inputRef.current?.setFocus();
      }, 100);
    },
    [inputValue, onAddTodo, showWarning, showError]
  );

  const handleInputChange = useCallback((e: any) => {
    setInputValue(e.detail.value || '');
  }, []);

  return (
    <IonCard className="todo-input-card">
      <IonCardContent>
        <form onSubmit={handleSubmit}>
          <IonItem lines="none" className="input-item">
            <IonInput
              ref={inputRef}
              value={inputValue}
              placeholder="What needs to be done?"
              onIonInput={handleInputChange}
              clearInput
              autocomplete="off"
              enterkeyhint="done"
              className="todo-input"
              maxlength={200}
              counter
            />
            <IonButton
              slot="end"
              type="submit"
              color="primary"
              disabled={!inputValue.trim() || inputValue.trim().length < 3}
              className="add-button"
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

// 使用 React.memo 优化重渲染
export default React.memo(TodoInput);
