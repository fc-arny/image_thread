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
          <div class="uploader-container">
            <span class="btn btn-success fileinput-button">
              <span> Add files...</span>
              #{file_field_tag(:source, options)}
              #{hidden_field(object_name, [method, 'images'].join('_'))}
            </span>
            <table class="table table-striped" styles="width: 650px"></table>
            <script id="template-upload" type="text/x-tmpl">
                {% for (var i=0, file; file=o.files[i]; i++) { %}
                  <tr class="template-upload">
                      <td style="width: 120px">
                          <span class="preview"></span>
                      </td>

                      <td>
                          {% if (!i) { %}
                              <button class="btn btn-warning cancel">
                                  <span>Cancel</span>
                              </button>
                              <button class="btn btn-danger delete" style="display: none" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                                    <span>Delete</span>
                              </button>
                          {% } %}
                          <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-bar progress-bar-success" style="width:0%;"></div></div>
                      </td>
                  </tr>
                {% } %}
              </script>
              <script id="template-download" type="text/x-tmpl">
                {% for (var i=0, file; file=o.files[i]; i++) { %}
                    <tr class="template-download">
                        <td>
                            <span class="preview">
                                {% if (file.thumbnailUrl) { %}
                                    <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
                                {% } %}
                            </span>
                        </td>
                        <td>
                            <p class="name">
                                {% if (file.url) { %}
                                    <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
                                {% } else { %}
                                    <span>{%=file.name%}</span>
                                {% } %}
                            </p>
                            {% if (file.error) { %}
                                <div><span class="label label-danger">Error</span> {%=file.error%}</div>
                            {% } %}
                        </td>
                        <td>
                            <span class="size">{%=o.formatFileSize(file.size)%}</span>
                        </td>
                        <td>
                            {% if (file.deleteUrl) { %}
                                <button class="btn btn-danger delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
                                    <span>Delete</span>
                                </button>
                            {% } else { %}
                                <button class="btn btn-warning cancel">
                                    <span>Cancel</span>
                                </button>
                            {% } %}
                        </td>
                    </tr>
                {% } %}
                </script>
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