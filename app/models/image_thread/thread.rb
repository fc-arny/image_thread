module ImageThread
  class Thread < ::ActiveRecord::Base
    self.table_name = ImageThread.thread_table_name.to_s

    has_many :images, class_name: '::ImageThread::Image'
    belongs_to :default_image, class_name: '::ImageThread::Image'
  end
end
