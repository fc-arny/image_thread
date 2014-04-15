module ImageThread
  module Uploaders
    class ImageUploader < ::CarrierWave::Uploader::Base
      include CarrierWave::MiniMagick

      # process resize_to_fit: [2000, 2000]
      process convert: :jpg

      def thumb(size)
        uploader = Class.new(self.class)
        uploader.versions.clear
        uploader.version_names = [size]

        img = uploader.new(self.model)
        img.retrieve_from_store!(self.file.identifier)
        cached = File.join(CarrierWave.root, img.url)

        unless File.exist?(cached)
          img.cache!(self)

          size = size.split('x').map(&:to_i)
          resizer = case size
                      when /[!#]/ then :resize_to_fit
                      else :resize_to_fill
                    end
          img.send(resizer, *size)
          img.store!
        end
        img
      end

      def extension_white_list
        %w(jpg jpeg gif png)
      end

      def filename
        "#{secure_token(25)}.#{file.extension}" if original_filename.present?
      end

      def store_dir
        dir = model.dir || 'all'

        ['uploads', 'images', dir, model.thread_id].join('/')
      end

      protected

      def secure_token(length = 20)
        var = :"@#{mounted_as}_secure_token"
        model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.hex(length/2))
      end

    end
  end
end
