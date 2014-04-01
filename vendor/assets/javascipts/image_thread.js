//= require jquery/ui/jquery.ui.widget
//= require load-image
//= require jquery/jquery.fileupload
//= require jquery/jquery.fileupload-process
//= require jquery/jquery.fileupload-image
//= require jquery/jquery.fileupload-ui

$(function(){
    $('.image_thread_fileupload').each(function(){
        $(this).fileupload({
            formData: {
                uploader: $(this).data('uploader'),
                thread:   $(this).data('thread'),
                dir:      $(this).data('dir')
            },

            previewCrop: true,
            previewMaxWidth: 120,
            previewMaxHeight: 120,
            filesContainer: $(this).closest('.uploader-container').find('.files')
        });
    });
});
