# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'image_thread/version'

Gem::Specification.new do |spec|
  spec.name          = 'image_thread'
  spec.version       = ImageThread::VERSION
  spec.authors       = ['Arthur Shcheglov(fc_arny)']
  spec.email         = ['arthur.shcheglov@gmail.com']
  spec.summary       = %q{Images for models}
  spec.description   = %q{Images for models}
  spec.homepage      = 'http://martsoft.ru/soft/image_thread'
  spec.license       = 'MIT'

  spec.files         = Dir['README.md', 'lib/**/*']
  spec.require_paths = ['lib']
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ['lib']

  spec.add_development_dependency 'bundler', '~> 1.5'
  spec.add_development_dependency 'rake'

  spec.add_dependency 'rails', '~>4.0.0'
  spec.add_dependency 'carrierwave'
  # spec.add_dependency 'rmagick'
  spec.add_dependency 'mini_magick'
  spec.add_dependency 'foreigner'
  spec.add_dependency 'migration_comments'
end
