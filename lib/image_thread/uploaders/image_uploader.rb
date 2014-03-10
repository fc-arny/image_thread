module ImageThread
  class ImageUploader < ::CarrierWave::Uploader::Base
    include CarrierWave::RMagick

    process :convert => 'png'

    def extension_white_list
      %w(jpg jpeg gif png)
    end

    def filename
      "#{secure_token(25)}.#{file.extension}" if original_filename.present?
    end

    def store_dir
      thread = model.thread_id || 'all'
      ['uploads/image_thread', thread].join('/')
    end

    protected

    def secure_token(length = 20)
      var = :"@#{mounted_as}_secure_token"
      model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.hex(length/2))
    end

  end
end
