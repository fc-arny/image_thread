module ImageThread
  class Thread < ::ActiveRecord::Base
    has_many :images, class_name: 'ImageThread::Image'

    belongs_to :item, polymorphic: true
    belongs_to :default_image, class_name: 'ImageThread::Image'
  end
end
