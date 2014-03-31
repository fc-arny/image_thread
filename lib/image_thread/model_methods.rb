module ImageThread
  module ModelMethods

    def self.included(base)
      base.extend ClassMethods
    end

    module ClassMethods
      def has_image_thread(field, opt = {})
        field_id            = [field, 'id'].join('_')
        before_save_method  = ['append_images', field].join('_')


        class_eval do
          belongs_to field, class_name: 'ImageThread::Thread'
          before_save before_save_method.to_sym

          define_method before_save_method do
            thread_id = @attributes[field_id].blank? ? ImageThread::Thread.create.id : @attributes[field_id]
            _assign_attribute(field_id, thread_id)

            transaction do
              instance_variable_get(:"@#{field}_images").each do |image|
                ImageThread::Image.where(id: image[:id]).update_all(state: image[:state], thread_id: thread_id) unless image[:state].blank?
              end
            end

            instance_variable_set(:"@#{field}_images", [])
          end

          define_method [field, 'images='].join('_') do |images|
            res = []
            images.split(',').each do |image|
              id, state = image.split(':')
              res << {id: id, state: state}
            end
            instance_variable_set(:"@#{field}_images", res)
          end

          define_method [field, 'images'].join('_') do
            instance_variable_get(:"@#{field}_images")
          end
        end
      end
    end
  end
end
