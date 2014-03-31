//= require jquery/ui/jquery.ui.widget
//= require load-image
//= require tmpl
//= require jquery/jquery.fileupload
//= require jquery/jquery.fileupload-process
//= require jquery/jquery.fileupload-image
//= require jquery/jquery.fileupload-ui

$(function(){
    $('.image_thread_fileupload').each(function(){
        $(this).fileupload({
            dataType: 'json',
            autoUpload: true,
            formData: {
                uploader: $(this).data('uploader'),
                thread:   $(this).data('thread'),
                dir:      $(this).data('dir')
            },

            filesContainer: $(document).find('.table'),

            done: function (e, data) {
                var images       = [],
                    $threadField = $(this).next(),
                    params_str   = $threadField.val();

                // Unpack params
                if(params_str.length > 0) {
                    var params = params_str.split(',');
                    for(var i in params) {
                        var vals = params[i].trim().split(':');
                        images['id' + vals[0]] = vals[1]
                    }
                }

                for(var i in data.result.files) {
                    images['id' + data.result.files[i].id] = data.result.files[i].state;
                }

                // Pack params
                var new_params = [];
                for(var i in images) {
                    new_params.push(i.replace('id', '') + ':' + images[i]);
                }

                $threadField.val(new_params.join(','));
                $(this)
            }
        });
    });
});
