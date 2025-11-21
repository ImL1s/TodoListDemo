class Todo < ApplicationRecord
  # Validations
  validates :text, presence: true, length: { maximum: 500 }
  validates :completed, inclusion: { in: [true, false] }

  # Scopes
  scope :active, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :recent, -> { order(created_at: :desc) }

  # Default values
  after_initialize :set_defaults, if: :new_record?

  private

  def set_defaults
    self.completed ||= false
  end
end
