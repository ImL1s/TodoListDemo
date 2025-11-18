import { Form, useNavigation } from '@remix-run/react';

interface TodoInputProps {
  error?: string;
}

export default function TodoInput({ error }: TodoInputProps) {
  const navigation = useNavigation();
  const isAdding = navigation.state === 'submitting' &&
    navigation.formData?.get('_action') === 'create';

  return (
    <div className="card">
      <Form method="post" className="todo-input-form">
        <input type="hidden" name="_action" value="create" />
        <div className="input-group">
          <input
            type="text"
            name="text"
            className="input-field"
            placeholder="What needs to be done?"
            required
            autoFocus
            disabled={isAdding}
            aria-label="New todo text"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'todo-error' : undefined}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isAdding}
            aria-label="Add todo"
          >
            {isAdding ? (
              <>
                <span className="loading-spinner" style={{ width: '16px', height: '16px' }}></span>
                Adding...
              </>
            ) : (
              <>
                <span aria-hidden="true">+</span>
                Add Todo
              </>
            )}
          </button>
        </div>
        {error && (
          <div id="todo-error" className="error-message" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}
      </Form>
    </div>
  );
}
