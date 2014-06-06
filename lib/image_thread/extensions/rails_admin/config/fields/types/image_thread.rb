module ImageThread
  module Extentions
    module RailsAdmin
      module Config
        module Fields
          module Types
            class ImageThread < ::RailsAdmin::Config::Fields::Base
              ::RailsAdmin::Config::Fields::Types.register(self)

              register_instance_option :partial do
                :image_thread
              end
            end
          end
        end
      end
    end
  end
end