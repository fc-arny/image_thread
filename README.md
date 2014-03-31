# ImageThread

Gem for multiply file upload (for backend).

One thread (thread of images) have many images. Attach thread to your model and
you get "album"

Dependencies:
1. carrierwave
2. foreigner



## Installation

Copy migration:

    rails generate image_thread:install

Then run this migration.


Add this line to your application's Gemfile:

    gem 'image_thread'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install image_thread

## Usage

### Add thread to model
1. Create filed %{your_thread_name}_id in your model (Link to thread)
2. Inside model class add line: has_image_thread :%{your_thread_name}

### Upload files
1. In form use this: image_thread_field helper(like text_field etc): form.image_thread_field(:%{your_thread_name}, options)

## Contributing

1. Fork it ( http://github.com/<my-github-username>/image_thread/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
