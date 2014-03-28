module ActionView
  module Helpers
    module FormHelper
      def image_thread_field(object_name, method, options = nil)
        options.update(class: 'image_thread_fileupload')
        options.update(data: { url:      image_thread_images_path,
                               uploader: ['image_thread_uploader', SecureRandom.hex(16)].join('_'),
                               thread:   options.delete(:thread),
                               dir:      options[:dir],
                               name:     [object_name, '[images_attributes]'].join})

        template = <<-HTML
          <span class="btn btn-success fileinput-button">
            <span> Add files...</span>
            #{file_field_tag(:source, options)}
          </span>
        HTML

        template.html_safe
      end
    end

    class FormBuilder
      def image_thread_field(method, options = {})
        options[:thread] = self.object.send([method, 'id'].join('_'))
        options[:dir] = (options[:dir] || self.object.class.to_s).parameterize('_')
        @template.image_thread_field(@object_name, method, options)
      end
    end
  end
end