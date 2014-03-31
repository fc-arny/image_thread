class CreateImageThreadTables < ActiveRecord::Migration
  def up
    create_table :image_thread_threads do |t|
      t.references  :default_image, default: nil,           comment: 'Reference to default image of thread'
      t.references  :owner,                                 comment: 'Thread owner'
      t.datetime    :created_at
    end

    add_index :image_thread_threads, :default_image_id

    create_table :image_thread_images do |t|
      t.references :thread
      t.string    :name,                                comment: 'Displayed file name'
      t.string    :source, null: false,                 comment: 'Real file name'
      t.string    :state, default: 'new', null: false,  comment: 'File state: active, new, deleted, archive'
      t.integer   :order_pos, default: 0,               comment: 'Order position'
      t.string    :dir, default: ''
      t.datetime  :created_at
    end

    add_index :image_thread_images, :thread_id

    add_foreign_key :image_thread_threads, :image_thread_images, column: :default_image_id, dependent: :nullify
    add_foreign_key :image_thread_images, :image_thread_threads, column: :thread_id, dependent: :nullify
  end

  def down
    remove_foreign_key :image_thread_threads, column: :default_image_id
    remove_foreign_key :image_thread_images, column: :thread_id

    remove_index :image_thread_threads, :default_image_id
    remove_index :image_thread_images, :thread_id

    drop_table :image_thread_images
    drop_table :image_thread_threads
  end
end
