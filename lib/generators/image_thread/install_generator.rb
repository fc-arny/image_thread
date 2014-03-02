require 'rails/generators'
require 'rails/generators/migration'
require 'rails/generators/active_record'

module ImageThread
  class InstallGenerator < ::Rails::Generators::Base
    include ::Rails::Generators::Migration

    source_root File.expand_path('../templates', __FILE__)
    class_option :with_changes, :type => :boolean, :default => false, :desc => "Store changeset (diff) with each version"

    desc 'Generates (but does not run) a migration to add image thread tables.'

    def create_migration_file
      migration_template 'create_image_thread_tables.rb', 'db/migrate/create_image_thread_tables.rb'
    end

    def self.next_migration_number(dirname)
      ::ActiveRecord::Generators::Base.next_migration_number(dirname)
    end
  end
end
