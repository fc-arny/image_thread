//= require ../jquery/ui/jquery.ui.widget
//= require ../load-image
//= require ../jquery/jquery.fileupload
//= require ../jquery/jquery.fileupload-process
//= require ../jquery/jquery.fileupload-image

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
            uploadTemplate: function(o) {
                var rows = $();
                $.each(o.files, function (index, file) {
                    var info = 'Name: ' + file.name + ' | Size: ' + o.formatFileSize(file.size);
                    var row = $(
                            '<div class="image-thread-item new" title="' + info + '">' +
                            '<div class="preview">' +
                            '<button class="btn btn-danger delete" title="Delete"><span>&times;</span></button>' +
                            '</div>' +
                            '<div class="restore"><button class="btn btn-info">Restore</button></div>' +
                            '<div class="error"></div>' +
                            '<input type="hidden" name="' + o.options.inputName + '" value="" />' +
                            '<a class="link" href="' + file.url + '">Link to original</a>' +
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

                var $this = $(this),
                    that = $this.data('blueimp-fileupload') || $this.data('fileupload'),
                    options = that.options;

                data.context = that._renderUpload(data.files)
                    .data('data', data)
                    .addClass('processing');

                options.filesContainer[options.prependFiles ? 'prepend' : 'append'](data.context);

                data.process(function () {
                    return $this.fileupload('process', data);
                }).done(function () {
                    if ((that._trigger('added', e, data) !== false) &&
                        (options.autoUpload || data.autoUpload) &&
                        data.autoUpload !== false) {
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
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload');
                if (data.context && data.dataType &&
                    data.dataType.substr(0, 6) === 'iframe') {
                    // Iframe Transport does not support progress events.
                    // In lack of an indeterminate progress bar, we set
                    // the progress to 100%, showing the full animated bar:
                    data.context
                        .find('.progress').addClass(
                            !$.support.transition && 'progress-animated'
                    )
                        .attr('aria-valuenow', 100)
                        .children().first().css(
                        'width',
                        '100%'
                    );
                }
                return that._trigger('sent', e, data);
            },
            // Callback for successful uploads:
            done: function (e, data) {
                var $imageInput = data.context.children().last();

                if (e.isDefaultPrevented()) {
                    return false;
                }

                // Default process
                var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                    getFilesFromResponse = data.getFilesFromResponse || that.options.getFilesFromResponse,
                    files = getFilesFromResponse(data),
                    deferred;

                data.context.each(function (index) {
                    var file = files[index] ||
                    {error: 'Empty file upload result'};

                    $imageInput.val(file.id + ':' + file.state);

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
                    template,
                    deferred;
                if (data.context) {
                    data.context.each(function (index) {
                        if (data.errorThrown !== 'abort') {
                            var file = data.files[index];
                            file.error = file.error || data.errorThrown ||
                                true;
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
                    that._forceReflow(data.context);
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
            // Callback for upload progress events:
            progress: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var progress = Math.floor(data.loaded / data.total * 100);
                if (data.context) {
                    data.context.each(function () {
                        $(this).find('.progress')
                            .attr('aria-valuenow', progress)
                            .children().first().css(
                            'width',
                                progress + '%'
                        );
                    });
                }
            },
            // Callback for uploads start, equivalent to the global ajaxStart event:
            start: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                    $(this).data('fileupload');
                that._resetFinishedDeferreds();
                that._transition($(this).find('.fileupload-progress')).done(
                    function () {
                        that._trigger('started', e);
                    }
                );
            },
            // Callback for uploads stop, equivalent to the global ajaxStop event:
            stop: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') ||
                        $(this).data('fileupload'),
                    deferred = that._addFinishedDeferreds();
                $.when.apply($, that._getFinishedDeferreds())
                    .done(function () {
                        that._trigger('stopped', e);
                    });
                that._transition($(this).find('.fileupload-progress')).done(
                    function () {
                        $(this).find('.progress')
                            .attr('aria-valuenow', '0')
                            .children().first().css('width', '0%');
                        $(this).find('.progress-extended').html('&nbsp;');
                        deferred.resolve();
                    }
                );
            },
            processstart: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                $(this).addClass('fileupload-processing');
            },
            processstop: function (e) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                $(this).removeClass('fileupload-processing');
            },
            // Callback for file deletion:
            destroy: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = $(this).data('blueimp-fileupload') || $(this).data('fileupload');

                that._transition(data.context).done(
                    function () {
                        $(this).find('.preview').hide();
                        $(this).find('.restore').show();
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

        _forceReflow: function (node) {
            return $.support.transition && node.length &&
                node[0].offsetWidth;
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
