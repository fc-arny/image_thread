require  'image_thread/uploaders/image_uploader'

module ImageThread
  class Image < ActiveRecord::Base
    self.table_name = ImageThread.image_table_name.to_s

    STATE_NEW     = :new
    STATE_READY   = :ready
    STATE_DELETED = :deleted

    STATES = [STATE_NEW, STATE_READY, STATE_DELETED]

    belongs_to :thread, class_name: 'ImageThread::Thread'

    mount_uploader :source, ImageThread::ImageUploader
  end
end
