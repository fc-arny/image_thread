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
                thread:   $(this).data('thread')
            },
            add: function (e, data) {
                $(this).closest('.btn').addClass('load');
                data.context = $('<p/>').text('Uploading...').appendTo(document.body);
                data.submit();
                console.log(data);
            },
            done: function (e, data) {
                $(this).closest('.btn').removeClass('load');
                data.context.text('Upload finished.');
            }
        });
    });
});
