require 'active_support'
require 'active_model'

require 'carrierwave'
require 'foreigner'
require 'migration_comments'

module ImageThread
  extend ActiveSupport::Autoload

  # Uploader
  autoload :ImageUploader, 'image_thread/uploaders/image_uploader'

  # Models
  autoload :Thread, 'image_thread/models/thread'
  autoload :Image, 'image_thread/models/image'

  def self.setup
    yield self
  end
end

require 'image_thread/version'
require 'image_thread/engine'