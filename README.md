# ImageThread

[![Code Climate](https://codeclimate.com/github/martsoft/image_thread.png)](https://codeclimate.com/github/martsoft/image_thread)
[![Gem Version](https://badge.fury.io/rb/image_thread.png)](http://badge.fury.io/rb/image_thread)

Gem for multiply file upload (for backend).

One thread (thread of images) have many images. Attach thread to your model and
you get "album"

Dependencies:
1. carrierwave
2. foreigner

## TODOs:
1. Single/Multi uploaders
2. Validators - size, count, format and etc
3. Handle errors
4. Customize uploaders
5. I18n
6. Reorder images in thread
7. Placeholder generator for nonexistent files
8. Tests!!!
9. Cache thumb creation

## Features
1. Dynamic thumbs (i.e. thread.image[0].thumb('120x120') or thread.image[0].thumb('300x100!'))
2. Settings: remove file on destroy(ex.: has_image_thread :images, delete: :file )
 
## Examples

## Installation

Add this line to your application's Gemfile:

    gem 'image_thread'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install image_thread

Copy migrations:

    rails generate image_thread:install

Then run this migration.

## Usage

### Setup client-side
Add js to your manifest file

    require image_thread

If you use custom class for uploader (default: '*.image_thread_fileupload*') require only uploader without init file

    require image_thread/uploader

and init uploader(s):

    $(function(){
        $('#custom-selector').each(function(){
            $(this).fileupload({
                formData: {
                    uploader: $(this).data('uploader'),
                    thread:   $(this).data('thread'),
                    dir:      $(this).data('dir')
                },
                inputName: $(this).data('name'),
                previewCrop: true,
                previewMaxWidth: 120,
                previewMaxHeight: 120,
                filesContainer: $(this).closest('.uploader-container').find('.files')
            });
        });
    });

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
