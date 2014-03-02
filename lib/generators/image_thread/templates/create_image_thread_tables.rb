class CreateImageThreadTables < ActiveRecord::Migration
  def up
    create_table :image_thread_threads do |t|
      t.references  :item, null: false, polymorphic: true,  comment: 'Reference to related model'
      t.references  :default_image, default: nil,           comment: 'Reference to default image of thread'
      t.datetime    :created_at
    end

    add_index :image_thread_threads, [:item_type, :item_id]
    add_index :image_thread_threads, :default_image_id

    create_table :image_thread_images do |t|
      t.references :image_thread
      t.string :name
      t.string :file, null: false
    end

    add_index :image_thread_images, :image_thread_id

    add_foreign_key :image_thread_threads, :image_thread_images, column: :default_image_id, dependent: :nullify
    add_foreign_key :image_thread_images, :image_thread_threads, column: :image_thread_id, dependent: :nullify
  end

  def down
    remove_foreign_key :image_thread_threads
    remove_foreign_key :image_thread_images
    remove_index :image_thread_threads, [:item_type, :item_id]
    remove_index :image_thread_threads, :default_image_id

    remove_index :image_thread_images, :image_thread_id

    drop_table :image_thread_images
    drop_table :image_thread_threads
  end
end
