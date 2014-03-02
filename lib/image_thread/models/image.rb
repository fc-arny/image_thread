module ImageThread
  class Image < ::ActiveRecord::Base
    belongs_to :image_thread, class_name: 'ImageThread::Thread'

    mount_uploader :file, ImageThread::ImageUploader
  end
end
