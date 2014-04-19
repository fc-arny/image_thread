module ActionView
  module Helpers
    module FormHelper
      def image_thread_field(object_name, method, options = nil)
        tag     = ActionView::Helpers::Tags::Base.new(object_name, [method, 'images'].join('_'), self)
        thread  = options.delete(:thread)

        options.update(class: 'image_thread_fileupload')
        options.update(data: { url:      '/image_thread/images',
                               uploader: [object_name, method, 'uploader', SecureRandom.hex(16)].join('_'),
                               thread:   thread.to_i,
                               dir:      options[:dir],
                               name:     tag.send(:tag_name, true) })

        template = <<-HTML
          <div class="uploader-container">
            <span class="btn btn-success fileinput-button">
              <span class="glyphicon glyphicon-plus"> Add files</span>
              #{file_field_tag(:source, options)}
            </span>
            <div class="files uploader-#{method} clearfix">#{render_image_thread(thread, tag.send(:tag_name, true))}</div>
          </div>
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