module ImageThread
  module Extentions
    module RailsAdmin
      module Config
        module Fields
          module Types
            class ImageThread < ::RailsAdmin::Config::Fields::Base
              ::RailsAdmin::Config::Fields::Types.register(self)

              def initialize(parent, name, properties)
                super(parent, name, properties)
              end

              register_instance_option :partial do
                :image_thread
              end

              register_instance_option :allowed_methods do
                [method_name, [method_name, 'images'].join('_')].compact
              end
            end
          end
        end
      end
    end
  end
end