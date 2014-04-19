module ImageThread
  class Engine < ::Rails::Engine
    config.autoload_paths += %W(#{config.root}/lib/**/)
    config.assets.paths += %W(#{config.root}/vendor/assets/fonts/)
  end
end
