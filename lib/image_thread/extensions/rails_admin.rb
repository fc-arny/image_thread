begin
  if defined?(RailsAdmin)
    require 'image_thread/extensions/rails_admin/config/fields'
  end
rescue LoadError => e
end