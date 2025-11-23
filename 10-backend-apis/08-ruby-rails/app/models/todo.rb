class Todo < ApplicationRecord
  # Validations
  validates :text, presence: true, length: { minimum: 1, maximum: 500 }
  validates :completed, inclusion: { in: [true, false] }

  # Sanitize text before saving to prevent XSS
  before_validation :sanitize_text

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

  def sanitize_text
    require 'cgi'
    self.text = CGI.escapeHTML(text) if text.present?
  end
end
