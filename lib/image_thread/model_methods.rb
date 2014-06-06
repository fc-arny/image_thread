module ImageThread
  module ModelMethods

    def self.included(base)
      base.extend ClassMethods
    end

    module ClassMethods
      def has_image_thread(field, opt = {})
        field_id            = [field, 'id'].join('_')
        before_save_method  = ['append_images', field].join('_')

        # Options
        delete = opt[:delete] || [] # :row, :files


        class_eval do
          belongs_to field, class_name: 'ImageThread::Thread'
          before_save before_save_method.to_sym

          define_method before_save_method do
            thread_id   = nil
            image_ids   = instance_variable_get(:"@#{field}_images").map { |i| i[:id] }

            ImageThread::Image.select('id, thread_id').where(id: image_ids).each do |image|
              if !thread_id.blank? && thread_id != image.thread_id
                raise DifferentThreads, "Try to save images from different thread as one. Image ids: #{image_ids}"
              end

              thread_id = image.thread_id
            end

            #TODO: Deactivate images

            transaction do
              instance_variable_get(:"@#{field}_images").each do |image|
                img = ImageThread::Image.find image[:id]

                unless img.blank?
                  img.update(state: image[:state]) unless image[:state].blank?

                  if img.state == ImageThread::Image::STATE_DELETED
                    # Remove all files
                    if delete.include?(:files)
                      dir_name  = File.dirname(img.source.path)
                      file_name = File.basename(img.source.path)

                      Dir.chdir(dir_name)
                      Dir.glob(['*', file_name].join).each do |file|
                        File.delete File.expand_path(file)
                      end

                      File.expand_path img.source
                    end

                    # Remove row from DB
                    img.destroy if delete.include?(:row) || delete.include?(:files)
                  end
                end

              end
            end

            _assign_attribute(field_id, thread_id)
            instance_variable_set(:"@#{field}_images", [])
          end

          define_method [field, 'images='].join('_') do |images|
            res = []
            images.each do |image|
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
