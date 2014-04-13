require 'rails/all'

require 'carrierwave'
require 'foreigner'
require 'migration_comments'
require 'image_thread/patches/form_helper'
require 'image_thread/model_methods'

module ImageThread
  extend ActiveSupport::Autoload

  mattr_accessor :image_table_name
  @@image_table_name = :image_thread_images

  mattr_accessor :thread_table_name
  @@thread_table_name = :image_thread_threads

  def self.setup
    yield self
  end
end

ActiveSupport.on_load(:active_record) do
  include ImageThread::ModelMethods
end

require 'image_thread/exceptions'
require 'image_thread/version'
require 'image_thread/engine'