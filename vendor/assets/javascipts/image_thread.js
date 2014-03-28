//= require load-image.min
//= require jquery/ui/jquery.ui.widget
//= require jquery/jquery.fileupload
//= require jquery/jquery.fileupload-process
//= require jquery/jquery.fileupload-image
//= require jquery/jquery.fileupload-validate
//= require jquery/jquery.fileupload-ui

$(function(){
    $('.image_thread_fileupload').each(function(){
        $(this).fileupload({
            dropZone: $(this),
            dataType: 'json',
            formData: {
                uploader: $(this).data('uploader'),
                thread:   $(this).data('thread'),
                dir:      $(this).data('dir')
            },
            add: function (e, data) {
                $(this).closest('.btn').addClass('load');
                data.context = $('<p/>').text('Uploading...').appendTo(document.body);
                data.submit();
                console.log(data);
            },
            done: function (e, data) {
                $(this).closest('.btn').removeClass('load');
                var number = data.result.image.id;
                var name    = 'city[cover_thread_images]' + number + ']';
                var $id      = $('<input>', {type: 'hidden', name: name + '[id]', value: data.result.image.id}),
                    $state   = $('<input>', {type: 'hidden', name: name + '[state]', value: data.result.image.state}),
                    $thread  = $('<input>', {type: 'hidden', name: name + '[thread_id]', value: data.result.image.thread_id});

                $id.insertAfter($(this));
                $state.insertAfter($(this));
                $thread.insertAfter($(this));

                data.context.text('Upload finished.');
            }
        });
    });
});
