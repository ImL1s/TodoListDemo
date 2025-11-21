class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :text, null: false
      t.boolean :completed, default: false, null: false

      t.timestamps
    end

    add_index :todos, :completed
  end
end
