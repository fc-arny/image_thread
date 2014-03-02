module ImageThread
  class ImageUploader < CarrierWave::Uploader::Base
    include CarrierWave::RMagick

    process :convert => 'png'

    def extension_white_list
      %w(jpg jpeg gif png)
    end


  end
end
