//= require ./jquery/ui/jquery.ui.widget
//= require ./load-image
//= require ./jquery/jquery.fileupload
//= require ./jquery/jquery.fileupload-process
//= require ./jquery/jquery.fileupload-image

(function ($) {
    'use strict';

    $.blueimp.fileupload.prototype._specialOptions.push(
        'filesContainer',
        'inputName'
    );

    $.widget('blueimp.fileupload', $.blueimp.fileupload, {

        options: {
            // The container for the list of files. If undefined, it is set to
            // an element with class "files" inside of the widget element:
            filesContainer: undefined,
            // By default, files are appended to the files container.
            // Set the following option to true, to prepend files instead:
            prependFiles: true,
            // The expected data type of the upload response, sets the dataType
            // option of the $.ajax upload requests:
            dataType: 'json',
            // Template for image item
            uploadTemplate: function(o) {
                var rows = $();
                $.each(o.files, function (index, file) {
                    var info = 'Name: ' + file.name + ' | Size: ' + o.formatFileSize(file.size);
                    var row = $(
                            '<div class="image-thread-item new" title="' + info + '">' +
                                '<div class="preview">' +
                                    '<button class="btn btn-danger delete" title="Delete"><span>&times;</span></button>' +
                                    '<button class="btn btn-default restore"><span class="glyphicon glyphicon-repeat"></span> Restore</button>' +
                                '</div>' +

                                '<div class="error"></div>' +

                                '<input class="value" type="hidden" name="' + o.options.inputName + '" value="" />' +
                                '<div class="input-group default-image">' +
                                    '<label class="radio">' +
                                        '<input type="radio" name="' + o.options.inputName + '" value="" />' +
                                        'Main image' +
                                    '</label>' +
                                '</div>' +
                            '</div>');

                    if (file.error) {
                        row.find('.error').text(file.error);
                    }
                    rows = rows.add(row);
                });
                return rows;
            },

            // Function returning the current number of files,
            // used by the maxNumberOfFiles validation:
            getNumberOfFiles: function () {
                return this.filesContainer.children()
                    .not('.processing').length;
            },

            // Callback to retrieve the list of files from the server response:
            getFilesFromResponse: function (data) {
                if (data.result && $.isArray(data.result.files)) {
                    return data.result.files;
                }
                return [];
            },

            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }

                var $this   = $(this),
                    that    = $this.data('blueimp-fileupload') || $this.data('fileupload'),
                    options = that.options;

                data.context = that._renderUpload(data.files)
                    .data('data', data)
                    .addClass('processing');

                options.filesContainer[options.prependFiles ? 'prepend' : 'append'](data.context);

                data.process(function () {
                    return $this.fileupload('process', data);
                }).done(function () {
                    if (that._trigger('added', e, data) !== false) {
                        data.submit();
                    }
                }).fail(function () {
                    if (data.files.error) {
                        data.context.each(function (index) {
                            var error = data.files[index].error;
                            if (error) {
                                $(this).find('.error').text(error);
                            }
                        }).removeClass('processing');
                    }
                });
            },
            // Callback for the start of each file upload request:
            send: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');

                return that._trigger('sent', e, data);
            },
            // Callback for successful uploads:
            done: function (e, data) {
                var $imageInput = data.context.find('.value'),
                    $defaultInput  = data.context.find('.default-image input');

                if (e.isDefaultPrevented()) {
                    return false;
                }

                // Default process
                var that                 = $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                    getFilesFromResponse = data.getFilesFromResponse || that.options.getFilesFromResponse,
                    files                = getFilesFromResponse(data),
                    deferred;

                data.context.each(function (index) {
                    var file = files[index] ||
                    {error: 'Empty file upload result'};

                    $imageInput.val(file.id + ':' + file.state);
                    $defaultInput.val(file.id + ':default');

                    deferred = that._addFinishedDeferreds();
                    $(this).removeClass('processing');
                    that._renderPreviews(data);
                });

            },
            // Callback for failed (abort or error) uploads:
            fail: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload'),
                    deferred;

                if (data.context) {
                    data.context.each(function (index) {
                        if (data.errorThrown !== 'abort') {
                            var file = data.files[index];
                            file.error = (file.error || data.errorThrown || true);
                            deferred = that._addFinishedDeferreds();
                        } else {
                            deferred = that._addFinishedDeferreds();
                            that._transition($(this)).done(
                                function () {
                                    $(this).remove();
                                    that._trigger('failed', e, data);
                                    that._trigger('finished', e, data);
                                    deferred.resolve();
                                }
                            );
                        }
                    });
                } else if (data.errorThrown !== 'abort') {
                    data.context = that._renderUpload(data.files)[
                        that.options.prependFiles ? 'prependTo' : 'appendTo'
                        ](that.options.filesContainer)
                        .data('data', data);
                    deferred = that._addFinishedDeferreds();
                    that._transition(data.context).done(
                        function () {
                            data.context = $(this);
                            that._trigger('failed', e, data);
                            that._trigger('finished', e, data);
                            deferred.resolve();
                        }
                    );
                } else {
                    that._trigger('failed', e, data);
                    that._trigger('finished', e, data);
                    that._addFinishedDeferreds().resolve();
                }
            },

            // Callback for uploads start, equivalent to the global ajaxStart event:
            start: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');

                that._resetFinishedDeferreds();
                that._transition($(this).find('.fileupload-progress')).done(
                    function () {
                        that._trigger('started', e);
                    }
                );
            },

            // Callback for file deletion:
            destroy: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that    = $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                    $input  = data.context.find('.value'),
                    values  = $input.val().split(':');

                values[1] = 'deleted';
                $input.val(values.join(':'));

                that._transition(data.context).done(
                    function () {
                        $(this).addClass('deleted');
                        that._trigger('destroyed', e, data);
                    }
                );
            }
        },

        _resetFinishedDeferreds: function () {
            this._finishedUploads = [];
        },

        _addFinishedDeferreds: function (deferred) {
            if (!deferred) {
                deferred = $.Deferred();
            }
            this._finishedUploads.push(deferred);
            return deferred;
        },

        _getFinishedDeferreds: function () {
            return this._finishedUploads;
        },

        _formatFileSize: function (bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        },

        _renderTemplate: function (func, files) {
            if (!func) {
                return $();
            }
            var result = func({
                files: files,
                formatFileSize: this._formatFileSize,
                options: this.options
            });

            return result;
        },

        _renderPreviews: function (data) {
            data.context.find('.preview').each(function (index, elm) {
                $(elm).append(data.files[index].preview);
            });
        },

        _renderUpload: function (files) {
            return this._renderTemplate(
                this.options.uploadTemplate,
                files
            );
        },

        _deleteHandler: function (e) {
            e.preventDefault();
            var button = $(e.currentTarget);
            this._trigger('destroy', e, $.extend({
                context: button.closest('.image-thread-item'),
                type: 'DELETE'
            }, button.data()));
        },

        _restoreHandler: function(e) {
            e.preventDefault();

            var $btn    = $(e.currentTarget),
                $item   = $btn.closest('.image-thread-item'),
                $input  = $item.find('.value'),
                values  = $input.val().split(':');

            values[1] = 'active';
            $input.val(values.join(':'));

            $item.removeClass('deleted');

        },

        _transition: function (node) {
            var dfd = $.Deferred();
            if ($.support.transition && node.hasClass('fade') && node.is(':visible')) {
                node.bind(
                    $.support.transition.end,
                    function (e) {
                        // Make sure we don't respond to other transitions events
                        // in the container element, e.g. from button elements:
                        if (e.target === node[0]) {
                            node.unbind($.support.transition.end);
                            dfd.resolveWith(node);
                        }
                    }
                ).toggleClass('in');
            } else {
                node.toggleClass('in');
                dfd.resolveWith(node);
            }
            return dfd;
        },

        _destroyButtonBarEventHandlers: function () {
            this._off(
                this.element.find('.fileupload-buttonbar')
                    .find('.delete'),
                'click'
            );
        },

        _initEventHandlers: function () {
            this._super();

            this._on(this.options.filesContainer, {
                'click .delete': this._deleteHandler
            });

            this._on(this.options.filesContainer, {
                'click .restore': this._restoreHandler
            });

        },

        _destroyEventHandlers: function () {
            this._destroyButtonBarEventHandlers();
            this._off(this.options.filesContainer, 'click');
            this._super();
        },

        _initFilesContainer: function () {
            var options = this.options;
            if (options.filesContainer === undefined) {
                options.filesContainer = this.element.find('.files');
            } else if (!(options.filesContainer instanceof $)) {
                options.filesContainer = $(options.filesContainer);
            }
        },

        _initSpecialOptions: function () {
            this._super();
            this._initFilesContainer();
        },

        _create: function () {
            this._super();
            this._resetFinishedDeferreds();
        }
    });

}(window.jQuery));
